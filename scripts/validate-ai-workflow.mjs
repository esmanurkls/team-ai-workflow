import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { hasCredential } from "./lib/secrets.mjs";
import { STATUSES, TASK_ID, TIER_FILES, UNFILLED_PROJECT_MARKER, section, tableRows } from "./lib/tasks.mjs";
import { SKILL_TARGETS } from "./sync-skills.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const onlyTask = process.argv[2];
const ruleFiles = ["collaboration.md", "security.md", "cost-optimization.md", "evidence-policy.md"];
const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  ".ai/WORKFLOW.md",
  ".ai/PROJECT.md",
  ...ruleFiles.map((file) => `.ai/rules/${file}`),
  ...TIER_FILES.full.map((file) => `.ai/templates/${file}`),
  ".ai/templates/decision.md",
  "scripts/make-context-pack.mjs",
  "scripts/new-task.mjs",
  "scripts/sync-skills.mjs",
];
const failures = [];
const warnings = [];

const read = (relative) => readFile(join(root, relative), "utf8").catch(() => null);
const exists = (relative) => access(join(root, relative)).then(() => true, () => false);

async function walk(relative) {
  const files = [];
  for (const entry of await readdir(join(root, relative), { withFileTypes: true }).catch(() => [])) {
    const child = `${relative}/${entry.name}`;
    if (entry.isDirectory()) files.push(...(await walk(child)));
    else files.push(child);
  }
  return files;
}

// --- Structure -------------------------------------------------------------
for (const file of requiredFiles) {
  if (!(await exists(file))) failures.push(`Missing required file: ${file}`);
}

const skillNames = (await readdir(join(root, ".ai", "skills"), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
for (const name of skillNames) {
  const relative = `.ai/skills/${name}/SKILL.md`;
  const content = await read(relative);
  if (content === null) {
    failures.push(`Missing skill entrypoint: ${relative}`);
    continue;
  }
  if (!content.startsWith("---\n") || !content.includes("\nname:") || !content.includes("\ndescription:")) {
    failures.push(`Invalid skill frontmatter: ${relative}`);
  }
  if (content.includes("TODO") || content.includes("<replace-me>")) {
    failures.push(`Unfinished placeholder in skill: ${relative}`);
  }
  for (const target of SKILL_TARGETS) {
    if ((await read(`${target}/${name}/SKILL.md`)) !== content) {
      failures.push(`${target}/${name} is out of sync with .ai/skills; run "npm run sync-skills"`);
    }
  }
}

const workflow = (await read(".ai/WORKFLOW.md")) ?? "";
for (const reference of [".ai/PROJECT.md", ...ruleFiles.map((file) => `.ai/rules/${file}`)]) {
  if (!workflow.includes(reference)) failures.push(`.ai/WORKFLOW.md does not reference ${reference}`);
}
for (const entry of ["AGENTS.md", "CLAUDE.md"]) {
  if (!((await read(entry)) ?? "").includes(".ai/WORKFLOW.md")) failures.push(`${entry} does not point to .ai/WORKFLOW.md`);
}
if (((await read(".ai/PROJECT.md")) ?? "").includes(UNFILLED_PROJECT_MARKER)) {
  warnings.push(".ai/PROJECT.md is still the unfilled template; fill it in the real project repo.");
}

const scanned = ["README.md", "AGENTS.md", "CLAUDE.md", ...(await walk(".ai")).filter((file) => !file.startsWith(".ai/context-packs/"))];
for (const relative of scanned) {
  if (hasCredential((await read(relative)) ?? "")) failures.push(`Possible credential in ${relative}`);
}

// --- Tasks -----------------------------------------------------------------
async function validateTask(taskId) {
  const fail = (message) => failures.push(`${taskId}: ${message}`);
  const dir = `.ai/runs/${taskId}`;
  const brief = await read(`${dir}/brief.md`);
  if (brief === null) return fail("brief.md is missing");

  const tier = /Tier:\s*`?(full|light)/.exec(brief)?.[1] ?? "full";
  const files = {};
  for (const file of TIER_FILES[tier]) {
    files[file] = await read(`${dir}/${file}`);
    if (files[file]?.includes("TASK-___")) fail(`${file} still has the TASK-___ placeholder`);
  }

  const status = /`([^`]+)`/.exec(section(files["handoff.md"] ?? "", "Status"))?.[1] ?? "planned";
  if (!STATUSES.includes(status)) return fail(`handoff.md has unknown status "${status}"`);
  if (status !== "verified" && status !== "done") return;

  // Definition of done: enforced once the task claims to be verified or done.
  for (const file of TIER_FILES[tier]) {
    if (files[file] === null) fail(`status is "${status}" but ${file} is missing (tier: ${tier})`);
  }
  const criteria = section(files["changes.md"] ?? "", "Acceptance criteria status");
  if (/- \[ \]/.test(criteria)) fail("changes.md has unchecked acceptance criteria");
  else if (!/- \[x\]/i.test(criteria)) fail("changes.md lists no acceptance criteria");

  const evidence = tier === "full" ? section(files["verification.md"] ?? "", "Checks") : section(files["changes.md"] ?? "", "Commands run");
  if (!tableRows(evidence).length) {
    fail(`no verification command recorded in ${tier === "full" ? "verification.md" : "changes.md"}`);
  }

  if (tier === "full" && files["redteam-review.md"]) {
    const review = files["redteam-review.md"];
    if (!/- \[x\]/i.test(section(review, "Surfaces reviewed"))) fail("redteam-review.md marks no reviewed surface");
    for (const block of section(review, "Findings").split(/^### /m).slice(1)) {
      const severity = /^\[?(P[0-3])\b/.exec(block)?.[1];
      if (!severity) continue;
      const title = block.split("\n")[0].trim();
      const disposition = /Disposition:[ \t]*(.*)/.exec(block)?.[1].trim() ?? "";
      if (!disposition || /^open\b/i.test(disposition)) fail(`finding "${title}" has no disposition`);
      else if (severity === "P0" && /^(deferred|ertelen)/i.test(disposition)) fail(`P0 finding "${title}" cannot be deferred`);
    }
  }
}

if (onlyTask) {
  if (!TASK_ID.test(onlyTask) || !(await exists(`.ai/runs/${onlyTask}`))) failures.push(`Unknown task: ${onlyTask}`);
  else await validateTask(onlyTask);
} else {
  for (const entry of await readdir(join(root, ".ai", "runs"), { withFileTypes: true }).catch(() => [])) {
    if (entry.isDirectory()) await validateTask(entry.name);
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`AI workflow valid: ${skillNames.length} skills, ${requiredFiles.length} required files checked.`);
}
