#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const lifecycleScriptNames = new Set(["preinstall", "install", "postinstall", "prepare"]);
const severityRank = {
  info: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4
};

const sensitiveCodePatterns = [
  { name: "network-http", pattern: /\b(?:require\(["'](?:node:)?https?["']\)|from ["'](?:node:)?https?["']|fetch\s*\(|XMLHttpRequest|WebSocket)\b/ },
  { name: "raw-socket", pattern: /\b(?:require\(["'](?:node:)?(?:net|tls|dgram)["']\)|from ["'](?:node:)?(?:net|tls|dgram)["'])/ },
  { name: "child-process", pattern: /\b(?:require\(["'](?:node:)?child_process["']\)|from ["'](?:node:)?child_process["']|execFile?\s*\(|spawn\s*\()/ },
  { name: "shell-script", pattern: /\b(?:curl|wget|Invoke-WebRequest|powershell|bash\s+-c|sh\s+-c)\b/ }
];

const args = parseArgs(process.argv.slice(2));
const root = resolve(args.root);
const packageJsonPath = join(root, "package.json");
const report = {
  root,
  mode: args.fix ? "fix" : "report",
  checks: [],
  findings: [],
  packageJsonScript: "node scripts/supply-chain-audit.mjs",
  recommendedPackageScripts: {
    "security:supply-chain": "node scripts/supply-chain-audit.mjs",
    "security:supply-chain:fix": "node scripts/supply-chain-audit.mjs --fix",
    "test:vulnerability": "npm run security:supply-chain"
  }
};

if (!existsSync(packageJsonPath)) {
  fail("package.json was not found. Run this script from a Node project root or pass --root <path>.");
}

const packageJson = readJson(packageJsonPath);
const packageManager = detectPackageManager(root);

checkLockfile(root);
checkDependencySpecs(packageJson);
checkLifecycleScripts(packageJson, "root package", []);
scanInstalledPackages(root);
runNpmAudit(root, args);

if (args.socket) {
  runSocketScan(root);
}

printReport(report, args.json);

if (report.findings.some((finding) => finding.level === "fail")) {
  process.exitCode = 1;
}

function parseArgs(argv) {
  const parsed = {
    root: process.cwd(),
    fix: false,
    json: false,
    socket: process.env.AGENT_GUIDE_SOCKET === "1",
    auditLevel: process.env.AGENT_GUIDE_AUDIT_LEVEL || "high",
    allowInstallScripts: csv(process.env.AGENT_GUIDE_ALLOW_INSTALL_SCRIPTS),
    allowNetworkPackages: csv(process.env.AGENT_GUIDE_ALLOW_NETWORK_PACKAGES)
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--root") {
      parsed.root = argv[index + 1] || parsed.root;
      index += 1;
      continue;
    }

    if (arg === "--fix") {
      parsed.fix = true;
      continue;
    }

    if (arg === "--json") {
      parsed.json = true;
      continue;
    }

    if (arg === "--socket") {
      parsed.socket = true;
      continue;
    }

    if (arg === "--audit-level") {
      parsed.auditLevel = argv[index + 1] || parsed.auditLevel;
      index += 1;
      continue;
    }

    if (arg === "--allow-install-scripts") {
      parsed.allowInstallScripts = new Set([...(parsed.allowInstallScripts || []), ...csv(argv[index + 1])]);
      index += 1;
      continue;
    }

    if (arg === "--allow-network-packages") {
      parsed.allowNetworkPackages = new Set([...(parsed.allowNetworkPackages || []), ...csv(argv[index + 1])]);
      index += 1;
      continue;
    }

    fail(`Unknown option: ${arg}`);
  }

  if (!(parsed.auditLevel in severityRank)) {
    fail(`Unsupported --audit-level "${parsed.auditLevel}". Use one of: ${Object.keys(severityRank).join(", ")}.`);
  }

  return parsed;
}

function csv(value = "") {
  return new Set(String(value).split(",").map((item) => item.trim()).filter(Boolean));
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function addCheck(name, status, detail) {
  report.checks.push({ name, status, detail });
}

function addFinding(level, check, message, detail = "") {
  report.findings.push({ level, check, message, detail });
}

function detectPackageManager(projectRoot) {
  if (existsSync(join(projectRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(projectRoot, "yarn.lock"))) return "yarn";
  if (existsSync(join(projectRoot, "package-lock.json"))) return "npm";
  return "unknown";
}

function checkLockfile(projectRoot) {
  const lockfiles = ["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock"]
    .filter((file) => existsSync(join(projectRoot, file)));

  if (lockfiles.length === 0) {
    addFinding("fail", "lockfile", "No dependency lockfile was found.", "Commit and use a lockfile so installs are reproducible.");
  }

  addCheck("lockfile", lockfiles.length > 0 ? "ok" : "fail", lockfiles.join(", ") || "missing");
}

function checkDependencySpecs(pkg) {
  const dependencyGroups = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
  let flagged = 0;

  for (const group of dependencyGroups) {
    for (const [name, spec] of Object.entries(pkg[group] || {})) {
      if (/^(?:git\+|git:|https?:|file:|link:|workspace:|\*)/.test(spec)) {
        flagged += 1;
        addFinding("warn", "dependency-spec", `${name} uses a non-registry or broad spec in ${group}.`, `${name}@${spec}`);
      }
    }
  }

  addCheck("dependency-spec", flagged === 0 ? "ok" : "warn", `${flagged} suspicious or broad specs`);
}

function checkLifecycleScripts(pkg, label, pathParts) {
  const scripts = pkg.scripts || {};
  const found = Object.keys(scripts).filter((script) => lifecycleScriptNames.has(script));

  if (found.length === 0) return;

  const packageName = pkg.name || pathParts.at(-1) || label;
  const allowed = args.allowInstallScripts.has(packageName);
  const level = allowed ? "warn" : "fail";

  addFinding(
    level,
    "install-lifecycle",
    `${packageName} defines install-time lifecycle scripts: ${found.join(", ")}.`,
    allowed
      ? "Allowed by configuration; keep the approval documented."
      : "Remove, replace, or explicitly allow after review. Install-time scripts can execute arbitrary code."
  );
}

function scanInstalledPackages(projectRoot) {
  const nodeModules = join(projectRoot, "node_modules");
  const packageJsonFiles = [];

  if (!existsSync(nodeModules)) {
    addCheck("installed-package-scan", "warn", "node_modules missing; run npm ci before deep package behavior checks.");
    addFinding("warn", "installed-package-scan", "node_modules was not found.", "Lifecycle and behavior scans could not inspect installed package contents.");
    return;
  }

  collectPackageJsonFiles(nodeModules, packageJsonFiles);

  let lifecyclePackages = 0;
  let networkPackages = 0;

  for (const file of packageJsonFiles) {
    const pkg = safeReadJson(file);
    if (!pkg) continue;

    const packageDir = file.slice(0, -"package.json".length);
    const previousFindings = report.findings.length;
    checkLifecycleScripts(pkg, "installed package", packageDir.split(/[\\/]/));

    if (report.findings.length > previousFindings) {
      lifecyclePackages += 1;
    }

    if (!args.allowNetworkPackages.has(pkg.name) && packageContainsSensitivePatterns(packageDir)) {
      networkPackages += 1;
      addFinding(
        "warn",
        "package-behavior",
        `${pkg.name || packageDir} contains network, shell, raw socket, or process execution indicators.`,
        "Review whether this package needs those capabilities. Use Socket or an equivalent behavior scanner for deeper analysis."
      );
    }
  }

  addCheck("installed-package-scan", "ok", `${packageJsonFiles.length} installed package manifests scanned`);
  addCheck("install-lifecycle", lifecyclePackages === 0 ? "ok" : "fail", `${lifecyclePackages} packages with install-time scripts`);
  addCheck("package-behavior", networkPackages === 0 ? "ok" : "warn", `${networkPackages} packages with sensitive behavior indicators`);
}

function collectPackageJsonFiles(directory, output) {
  for (const entry of safeReadDir(directory)) {
    if (entry === ".bin") continue;

    const fullPath = join(directory, entry);
    const stats = safeStat(fullPath);
    if (!stats?.isDirectory()) continue;

    if (entry.startsWith("@")) {
      collectPackageJsonFiles(fullPath, output);
      continue;
    }

    const manifest = join(fullPath, "package.json");
    if (existsSync(manifest)) {
      output.push(manifest);
    }
  }
}

function packageContainsSensitivePatterns(packageDir) {
  const files = [];
  collectSmallSourceFiles(packageDir, files);

  for (const file of files) {
    const content = safeReadText(file);
    if (!content) continue;

    if (sensitiveCodePatterns.some(({ pattern }) => pattern.test(content))) {
      return true;
    }
  }

  return false;
}

function collectSmallSourceFiles(directory, output, depth = 0) {
  if (depth > 3 || output.length > 40) return;

  for (const entry of safeReadDir(directory)) {
    if (["node_modules", "test", "tests", "coverage", "docs", "examples", "dist"].includes(entry)) continue;

    const fullPath = join(directory, entry);
    const stats = safeStat(fullPath);
    if (!stats) continue;

    if (stats.isDirectory()) {
      collectSmallSourceFiles(fullPath, output, depth + 1);
      continue;
    }

    if (stats.size > 200_000) continue;
    if (/\.(?:mjs|cjs|js|ts|jsx|tsx|sh|ps1)$/.test(entry)) {
      output.push(fullPath);
    }
  }
}

function runNpmAudit(projectRoot, options) {
  if (!["npm", "unknown"].includes(packageManager) && !existsSync(join(projectRoot, "package-lock.json"))) {
    addCheck("npm-audit", "warn", `${packageManager} project without package-lock.json; npm audit may not reflect the canonical lockfile.`);
  }

  if (options.fix) {
    const fix = spawnSync("npm", ["audit", "fix", "--audit-level", options.auditLevel], {
      cwd: projectRoot,
      encoding: "utf8",
      shell: false
    });

    addCheck("npm-audit-fix", fix.status === 0 ? "ok" : "fail", trimOutput(fix.stdout || fix.stderr));

    if (fix.status !== 0) {
      addFinding("fail", "npm-audit-fix", "npm audit fix did not complete cleanly.", trimOutput(fix.stderr || fix.stdout));
    }
  }

  const audit = spawnSync("npm", ["audit", "--json", "--audit-level", options.auditLevel], {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false
  });

  const auditJson = parseAuditJson(audit.stdout);
  const vulnerabilities = auditJson?.metadata?.vulnerabilities || {};
  const failingCount = Object.entries(vulnerabilities)
    .filter(([severity]) => severityRank[severity] >= severityRank[options.auditLevel])
    .reduce((sum, [, count]) => sum + Number(count || 0), 0);

  addCheck("npm-audit", failingCount === 0 ? "ok" : "fail", JSON.stringify(vulnerabilities));

  if (failingCount > 0) {
    addFinding(
      "fail",
      "npm-audit",
      `${failingCount} vulnerabilities meet or exceed ${options.auditLevel} severity.`,
      "Run with --fix only after reviewing package changes, release notes, and regression risk."
    );
  }

  if (!auditJson && audit.status !== 0) {
    addFinding("fail", "npm-audit", "npm audit failed before producing a parseable report.", trimOutput(audit.stderr || audit.stdout));
  }
}

function runSocketScan(projectRoot) {
  const socket = spawnSync("npx", ["--yes", "socket", "ci"], {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false
  });

  addCheck("socket-ci", socket.status === 0 ? "ok" : "fail", trimOutput(socket.stdout || socket.stderr));

  if (socket.status !== 0) {
    addFinding("fail", "socket-ci", "Socket scan reported a problem or could not run.", trimOutput(socket.stderr || socket.stdout));
  }
}

function parseAuditJson(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function safeReadJson(file) {
  try {
    return readJson(file);
  } catch {
    return null;
  }
}

function safeReadText(file) {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function safeReadDir(directory) {
  try {
    return readdirSync(directory);
  } catch {
    return [];
  }
}

function safeStat(file) {
  try {
    return statSync(file);
  } catch {
    return null;
  }
}

function trimOutput(output) {
  return String(output || "").trim().split("\n").slice(-12).join("\n");
}

function printReport(data, asJson) {
  if (asJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log("Supply Chain Audit");
  console.log(`Root: ${data.root}`);
  console.log(`Mode: ${data.mode}`);
  console.log("");
  console.log("Checks:");

  for (const check of data.checks) {
    console.log(`- ${check.status.toUpperCase()} ${check.name}: ${check.detail}`);
  }

  console.log("");
  console.log("Findings:");

  if (data.findings.length === 0) {
    console.log("- None");
  } else {
    for (const finding of data.findings) {
      console.log(`- ${finding.level.toUpperCase()} ${finding.check}: ${finding.message}`);
      if (finding.detail) {
        console.log(`  ${finding.detail}`);
      }
    }
  }

  console.log("");
  console.log("Recommended package.json scripts:");
  for (const [name, command] of Object.entries(data.recommendedPackageScripts)) {
    console.log(`- "${name}": "${command}"`);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
