// Shared task conventions for new-task, validate and context-pack.
export const TASK_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
export const TIER_FILES = {
  full: ["brief.md", "plan.md", "changes.md", "redteam-review.md", "verification.md", "handoff.md"],
  light: ["brief.md", "changes.md", "handoff.md"],
};
export const STATUSES = ["planned", "implementing", "in-review", "verified", "blocked", "done"];
export const UNFILLED_PROJECT_MARKER = "<!-- TEMPLATE: unfilled -->";

export function section(content, heading) {
  const lines = content.split("\n");
  const start = lines.findIndex((line) => line.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (start === -1) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^## /.test(line));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

export function tableRows(text) {
  return text
    .split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .slice(2)
    .map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()))
    .filter((cells) => cells[0]);
}
