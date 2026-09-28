import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  ".ai/WORKFLOW.md",
  ".ai/rules/collaboration.md",
  ".ai/rules/security.md",
  ".ai/rules/cost-optimization.md",
  ".ai/rules/evidence-policy.md",
  ".ai/templates/task-brief.md",
  ".ai/templates/plan.md",
  ".ai/templates/changes.md",
  ".ai/templates/redteam-review.md",
  ".ai/templates/verification.md",
  ".ai/templates/handoff.md",
  "scripts/make-context-pack.mjs",
];
const skillsRoot = join(root, ".ai", "skills");
const failures = [];

async function exists(relative) {
  try {
    await access(join(root, relative));
    return true;
  } catch {
    return false;
  }
}

for (const file of requiredFiles) {
  if (!(await exists(file))) failures.push(`Missing required file: ${file}`);
}

for (const entry of await readdir(skillsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const relative = `.ai/skills/${entry.name}/SKILL.md`;
  const path = join(root, relative);
  if (!(await exists(relative))) {
    failures.push(`Missing skill entrypoint: ${relative}`);
    continue;
  }
  const content = await readFile(path, "utf8");
  if (!content.startsWith("---\n") || !content.includes("\nname:") || !content.includes("\ndescription:")) {
    failures.push(`Invalid skill frontmatter: ${relative}`);
  }
  if (content.includes("TODO") || content.includes("<replace-me>")) {
    failures.push(`Unfinished placeholder in skill: ${relative}`);
  }
}

for (const entry of ["AGENTS.md", "CLAUDE.md"]) {
  const content = await readFile(join(root, entry), "utf8");
  if (!content.includes(".ai/WORKFLOW.md")) failures.push(`${entry} does not point to .ai/WORKFLOW.md`);
}

const textFiles = ["README.md", "AGENTS.md", "CLAUDE.md", ".ai/WORKFLOW.md"];
for (const relative of textFiles) {
  const content = await readFile(join(root, relative), "utf8");
  if (/\b(?:sk|ghp|github_pat|xoxb|figd)_[A-Za-z0-9_-]{12,}\b/.test(content)) {
    failures.push(`Possible credential in ${relative}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  const skills = (await readdir(skillsRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory()).length;
  console.log(`AI workflow valid: ${skills} skills, ${requiredFiles.length} required files checked.`);
}
