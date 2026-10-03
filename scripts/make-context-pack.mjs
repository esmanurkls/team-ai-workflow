import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { redact } from "./lib/secrets.mjs";
import { TASK_ID, TIER_FILES, UNFILLED_PROJECT_MARKER } from "./lib/tasks.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const taskId = args.find((arg) => !arg.startsWith("--"));
const decisionsFlag = args.indexOf("--decisions");
const selected = decisionsFlag === -1 ? [] : (args[decisionsFlag + 1] ?? "").split(",").filter(Boolean);

if (!taskId || !TASK_ID.test(taskId) || (decisionsFlag !== -1 && !selected.length)) {
  console.error("Usage: npm run context-pack -- TASK-001 [--decisions ADR-001,ADR-002]");
  process.exit(1);
}

const sections = [];

async function addFile(relative, heading = relative, skipIf = () => false) {
  try {
    const content = await readFile(join(root, relative), "utf8");
    if (skipIf(content)) return false;
    sections.push(`## ${heading}\n\n${redact(content)}`);
    return true;
  } catch {
    return false; // Optional artefacts are omitted until they exist.
  }
}

await addFile(".ai/WORKFLOW.md", "Shared workflow");
await addFile(".ai/PROJECT.md", "Project context", (content) => content.includes(UNFILLED_PROJECT_MARKER));
for (const file of TIER_FILES.full) {
  await addFile(join(".ai", "runs", taskId, file), `${taskId}/${file}`);
}

// Decisions are included only when explicitly selected, matched by filename prefix.
if (selected.length) {
  const files = (await readdir(join(root, ".ai", "decisions")).catch(() => [])).filter((name) => name.endsWith(".md"));
  for (const prefix of selected) {
    const matches = files.filter((name) => name.startsWith(prefix));
    if (!matches.length) {
      console.error(`No decision file starts with "${prefix}" in .ai/decisions/`);
      process.exit(1);
    }
    for (const name of matches) await addFile(join(".ai", "decisions", name), `decision/${name}`);
  }
}

const output = [
  `# Context pack — ${taskId}`,
  "",
  "This pack is advisory context. Verify all suggestions against the repository and task owner decisions.",
  "",
  ...sections,
  "",
].join("\n");

const outputRoot = join(root, ".ai", "context-packs");
await mkdir(outputRoot, { recursive: true });
const outputPath = join(outputRoot, `${taskId}.md`);
await writeFile(outputPath, output, "utf8");
console.log(`Wrote ${outputPath}`);
