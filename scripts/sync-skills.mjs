// Copies .ai/skills (the single source of truth) to the folders each tool auto-discovers.
import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SKILL_TARGETS = [".claude/skills", ".agents/skills"];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const target of SKILL_TARGETS) {
    const path = join(root, target);
    await rm(path, { recursive: true, force: true });
    await mkdir(dirname(path), { recursive: true });
    await cp(join(root, ".ai", "skills"), path, { recursive: true });
    console.log(`Synced .ai/skills -> ${target}`);
  }
}
