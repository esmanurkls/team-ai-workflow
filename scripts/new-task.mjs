import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TASK_ID, TIER_FILES } from "./lib/tasks.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const taskId = args.find((arg) => !arg.startsWith("--"));
const tier = args.includes("--light") ? "light" : "full";

if (!taskId || !TASK_ID.test(taskId)) {
  console.error("Usage: npm run new-task -- TASK-001 [--light]");
  process.exit(1);
}

const taskDir = join(root, ".ai", "runs", taskId);
try {
  await access(taskDir);
  console.error(`Task already exists: .ai/runs/${taskId}`);
  process.exit(1);
} catch {
  // Expected: the task does not exist yet.
}

await mkdir(taskDir, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
for (const file of TIER_FILES[tier]) {
  const template = await readFile(join(root, ".ai", "templates", file), "utf8");
  const content = template
    .replaceAll("TASK-___", taskId)
    .replace("- Tier: `full`", `- Tier: \`${tier}\``)
    .replace("- Date:", `- Date: ${today}`);
  await writeFile(join(taskDir, file), content, "utf8");
}
console.log(`Created .ai/runs/${taskId} (${tier}): ${TIER_FILES[tier].join(", ")}`);
