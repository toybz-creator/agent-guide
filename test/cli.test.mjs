import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const packageRoot = resolve(import.meta.dirname, "..");
const cli = join(packageRoot, "bin", "the-production-agent-skill.mjs");

function run(args, options = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: packageRoot,
    encoding: "utf8",
    ...options
  });
}

test("package rule framework validates", () => {
  const result = run(["doctor", "--package-root", packageRoot, "--package-only"]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Rule framework: ok \(\d+ numbered rules\)/);
});

test("README activation matches the CLI snippet", () => {
  const result = run(["snippet"]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const readme = readFileSync(join(packageRoot, "README.md"), "utf8");
  assert.ok(
    readme.includes(`\`\`\`markdown\n${result.stdout.trim()}\n\`\`\``),
    "README activation block drifted from the CLI snippet"
  );
});

test("init scaffolds the planning-notes, QA-profile, and synchronise-project contracts", () => {
  const root = mkdtempSync(join(tmpdir(), "production-agent-init-"));
  const result = run(["init", "--root", root]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const planningReadme = readFileSync(
    join(root, "harness", "planning-notes", "README.md"),
    "utf8"
  );
  assert.match(planningReadme, /Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration/);
  const verdicts = readFileSync(join(root, "harness", "verdicts.md"), "utf8");
  assert.match(verdicts, /qa-test-profile: unset/);
  assert.match(verdicts, /qa-manual-browser-testing: unset/);
  assert.match(result.stdout, /Next stage: complete the initial harness setup/);
  assert.match(result.stdout, /Review and modify harness\/verdicts\.md/);
  assert.match(result.stdout, /pag-synchronise-project/);
  const skills = readFileSync(join(root, "harness", "skills.md"), "utf8");
  const synchroniseProject = readFileSync(
    join(root, "harness", "skills", "synchronise-project.md"),
    "utf8"
  );
  assert.match(skills, /pag-synchronise-project/);
  assert.match(synchroniseProject, /Synchronise the living harness/);
});

test("task creation is non-destructive and verify-task detects incomplete rewrite", () => {
  const root = mkdtempSync(join(tmpdir(), "production-agent-task-"));
  const taskId = "20260704-cli-contract";
  const created = run([
    "task",
    "--root",
    root,
    "--id",
    taskId,
    "--title",
    "CLI contract"
  ]);
  assert.equal(created.status, 0, created.stdout + created.stderr);

  const path = join(root, "harness", "planning-notes", taskId, "implementation-guide.md");
  assert.match(readFileSync(path, "utf8"), /## Refined Working Prompt/);

  const duplicate = run(["task", "--root", root, "--id", taskId, "--title", "Overwrite"]);
  assert.notEqual(duplicate.status, 0);
  assert.match(duplicate.stderr, /was not overwritten/);

  const incomplete = run(["verify-task", "--root", root, "--id", taskId, "--stage", "rewrite"]);
  assert.notEqual(incomplete.status, 0);
  assert.match(incomplete.stdout, /incomplete for rewrite/);
});

test("verify-task accepts task-specific evidence through planning", () => {
  const root = mkdtempSync(join(tmpdir(), "production-agent-verify-"));
  const taskId = "20260704-planning-proof";
  const created = run(["task", "--root", root, "--id", taskId, "--title", "Planning proof"]);
  assert.equal(created.status, 0, created.stdout + created.stderr);

  const path = join(root, "harness", "planning-notes", taskId, "implementation-guide.md");
  let guide = readFileSync(path, "utf8");
  guide = guide
    .replace(
      "_Record the request verbatim when safe and concise, otherwise write a faithful summary._",
      "Add a verified task lifecycle to the package."
    )
    .replace(
      "_Write the researched, product-aware working prompt before planning._",
      "Implement and verify the six-stage lifecycle without overwriting downstream work."
    )
    .replace("| TBD | TBD | TBD | TBD |", "| README.md | Contract | Existing CLI behavior | Current checkout |")
    .replace(
      "_Describe users, current behavior, desired outcome, product direction, success criteria, constraints, dependencies, risks, and relevant non-functional needs._",
      "Package users need observable planning and verification evidence."
    )
    .replaceAll("- TBD", "- No unresolved item for this focused test.")
    .replace("Task classes: TBD", "Task classes: CLI, documentation")
    .replace(
      "| TBD | TBD | TBD | TBD | Selected |",
      "| PAG-CORE-025 | instructions.md | Six stages | CLI test | Selected |\n| PAG-RWR-016 | instructions.md | Refined prompt | Guide inspection | Selected |\n| PAG-PLN-012 | instructions.md | Recorded plan | Guide inspection | Selected |"
    )
    .replace(
      "_Describe the expected system, boundaries, data flow, patterns, alternatives, tradeoffs, security, reliability, operability, rollout, and rollback._",
      "The CLI owns non-destructive task creation and structural verification."
    )
    .replace(
      "| 1 | TBD | TBD | TBD | TBD |",
      "| 1 | Add task verifier | CLI | Rule contract | Node test |"
    )
    .replace(
      "| TBD | TBD | TBD | TBD |",
      "| Task guide contract | Integration | npm test | Passing CLI test |"
    );
  writeFileSync(path, guide);

  const result = run(["verify-task", "--root", root, "--id", taskId, "--stage", "planning"]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /planning evidence present/);
});

test("verify-task requires and accepts complete lifecycle rule evidence", () => {
  const root = mkdtempSync(join(tmpdir(), "production-agent-complete-"));
  const taskId = "20260704-complete-proof";
  const created = run(["task", "--root", root, "--id", taskId, "--title", "Complete proof"]);
  assert.equal(created.status, 0, created.stdout + created.stderr);

  const path = join(root, "harness", "planning-notes", taskId, "implementation-guide.md");
  const sections = [
    "Initial Request",
    "Refined Working Prompt",
    "Context And Evidence",
    "Product And Task Understanding",
    "Scope, Non-Goals, Assumptions, And Open Questions",
    "Task Classification And Rule Register",
    "Architecture And Design Decisions",
    "Implementation Plan And Change Map",
    "Test And Evaluation Matrix",
    "Implementation Log",
    "Evaluation Evidence",
    "Feedback Report",
    "Iteration, Harness Updates, Residual Risks, And Follow-Ups"
  ];
  const rules = [
    "PAG-CORE-025",
    "PAG-RWR-016",
    "PAG-PLN-012",
    "PAG-IMP-001",
    "PAG-EVL-001",
    "PAG-FDB-001",
    "PAG-ITR-001",
    "PAG-DONE-001"
  ];
  const guide = [
    "# Implementation Guide: Complete proof",
    "",
    "## Metadata",
    "",
    `- Task ID: \`${taskId}\``,
    "- Status: complete",
    "- Current stage: Complete",
    "- Risk level: Low",
    "- Strictness: Standard",
    "",
    ...sections.flatMap((section) => [
      `## ${section}`,
      "",
      section === "Task Classification And Rule Register"
        ? `Selected and evidenced rules: ${rules.join(", ")}.`
        : `Task-specific completion evidence for ${section}.`,
      ""
    ])
  ].join("\n");
  writeFileSync(path, guide);

  const result = run(["verify-task", "--root", root, "--id", taskId, "--stage", "complete"]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /complete evidence present/);
});
