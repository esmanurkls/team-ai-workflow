import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const taskId = process.argv[2];

if (!taskId || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(taskId)) {
  console.error("Usage: npm run context-pack -- TASK-001");
  process.exit(1);
}

const outputRoot = join(root, ".ai", "context-packs");
const taskFiles = ["brief.md", "plan.md", "changes.md", "redteam-review.md", "verification.md", "handoff.md"];
const sections = [];

function redact(value) {
  return value
    .replace(/\b(?:sk|ghp|github_pat|xoxb|figd)_[A-Za-z0-9_-]{12,}\b/g, "[REDACTED_CREDENTIAL]")
    .replace(/(Bearer\s+)[A-Za-z0-9._-]+/gi, "$1[REDACTED_CREDENTIAL]")
    .replace(/((?:password|secret|token|api[_-]?key)\s*[:=]\s*)\S+/gi, "$1[REDACTED]");
}

async function addFile(relative, heading = relative) {
  const path = join(root, relative);
  try {
    await access(path);
    sections.push(`## ${heading}\n\n${redact(await readFile(path, "utf8"))}`);
  } catch {
    // Optional task artefacts are omitted until they exist.
  }
}

await addFile(".ai/WORKFLOW.md", "Shared workflow");
for (const file of taskFiles) {
  await addFile(join(".ai", "runs", taskId, file), `${taskId}/${file}`);
}

try {
  const decisions = (await readdir(join(root, ".ai", "decisions"), { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .sort()
    .slice(0, 10);
  for (const decision of decisions) {
    await addFile(join(".ai", "decisions", decision.name), `decision/${decision.name}`);
  }
} catch {
  // Decisions are optional until the project has durable decisions.
}

const output = [
  `# Context pack — ${taskId}`,
  "",
  "This pack is advisory context. Verify all suggestions against the repository and task owner decisions.",
  "",
  ...sections,
  "",
].join("\n");

await mkdir(outputRoot, { recursive: true });
const outputPath = join(outputRoot, `${taskId}.md`);
await writeFile(outputPath, output, "utf8");
console.log(`Wrote ${outputPath}`);
