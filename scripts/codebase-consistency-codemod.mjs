#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const DEFAULT_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  ".turbo",
  "coverage",
  "vendor"
]);

const args = parseArgs(process.argv.slice(2));
const root = resolve(args.root);
const quote = args.quote;
const write = args.write;

if (!["single", "double"].includes(quote)) {
  fail("Pass --quote single or --quote double. If the project standard is unclear, ask before rewriting files.");
}

const formatter = detectFormatter(root);
const files = collectFiles(root);
const changed = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const next = convertQuotes(source, quote);

  if (next !== source) {
    changed.push(file);
    if (write) {
      writeFileSync(file, next);
    }
  }
}

console.log(`${write ? "Updated" : "Would update"} ${changed.length} file(s).`);
for (const file of changed.slice(0, 100)) {
  console.log(`  - ${file}`);
}
if (changed.length > 100) {
  console.log(`  ...and ${changed.length - 100} more`);
}

console.log("");
console.log("Detected formatter:", formatter ?? "none");
console.log(
  write
    ? "Run the project formatter and focused tests after this codemod."
    : "Dry run only. Re-run with --write after confirming this matches the project standard."
);

function parseArgs(argv) {
  const parsed = {
    root: process.cwd(),
    quote: "single",
    write: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      parsed.root = argv[index + 1] ?? ".";
      index += 1;
      continue;
    }
    if (arg === "--quote") {
      parsed.quote = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--write") {
      parsed.write = true;
      continue;
    }
    fail(`Unknown option: ${arg}`);
  }

  return parsed;
}

function collectFiles(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;

    const absolute = join(dir, entry);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      files.push(...collectFiles(absolute));
      continue;
    }

    const extension = absolute.match(/\.[^.]+$/)?.[0] ?? "";
    if (DEFAULT_EXTENSIONS.has(extension)) {
      files.push(absolute);
    }
  }

  return files;
}

function detectFormatter(projectRoot) {
  if (existsSync(join(projectRoot, "biome.json")) || existsSync(join(projectRoot, "biome.jsonc"))) {
    return "biome";
  }
  if (
    existsSync(join(projectRoot, ".prettierrc")) ||
    existsSync(join(projectRoot, ".prettierrc.json")) ||
    existsSync(join(projectRoot, "prettier.config.js")) ||
    existsSync(join(projectRoot, "prettier.config.mjs"))
  ) {
    return "prettier";
  }
  if (
    existsSync(join(projectRoot, "eslint.config.js")) ||
    existsSync(join(projectRoot, "eslint.config.mjs")) ||
    existsSync(join(projectRoot, ".eslintrc.json"))
  ) {
    return "eslint";
  }
  return null;
}

function convertQuotes(source, targetQuote) {
  const target = targetQuote === "single" ? "'" : "\"";
  const other = targetQuote === "single" ? "\"" : "'";
  let output = "";
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    if (char !== other) {
      output += char;
      index += 1;
      continue;
    }

    const parsed = readString(source, index, other);
    if (!parsed) {
      output += char;
      index += 1;
      continue;
    }

    const body = parsed.value
      .replaceAll(`\\${target}`, target)
      .replaceAll(target, `\\${target}`);
    output += `${target}${body}${target}`;
    index = parsed.end + 1;
  }

  return output;
}

function readString(source, start, quoteChar) {
  let value = "";

  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\n" || char === "\r") return null;

    if (char === "\\") {
      value += char;
      index += 1;
      if (index < source.length) value += source[index];
      continue;
    }

    if (char === quoteChar) {
      return { value, end: index };
    }

    value += char;
  }

  return null;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
