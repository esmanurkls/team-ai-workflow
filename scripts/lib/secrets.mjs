// Shared credential detection and redaction. Used by validate and context-pack.
export const CREDENTIAL_PATTERNS = [
  /\bsk-[A-Za-z0-9_-]{20,}/g, // OpenAI, Anthropic (sk-ant-, sk-proj-)
  /\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{16,}/g, // Stripe
  /\b(?:sk|xoxb)_[A-Za-z0-9_-]{12,}/g, // generic underscore-style keys
  /\bgh[pousr]_[A-Za-z0-9]{20,}/g, // GitHub tokens
  /\bgithub_pat_[A-Za-z0-9_]{20,}/g,
  /\bxox[abeprs]-[A-Za-z0-9-]{10,}/g, // Slack
  /\bfigd_[A-Za-z0-9_-]{12,}/g, // Figma
  /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, // AWS access key id
  /\bAIza[0-9A-Za-z_-]{35}/g, // Google API key
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, // JWT
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
];

export function hasCredential(value) {
  return CREDENTIAL_PATTERNS.some((pattern) => value.search(pattern) !== -1);
}

export function redact(value) {
  let result = value;
  for (const pattern of CREDENTIAL_PATTERNS) result = result.replace(pattern, "[REDACTED_CREDENTIAL]");
  return result
    .replace(/(Bearer\s+)[A-Za-z0-9._-]+/gi, "$1[REDACTED_CREDENTIAL]")
    .replace(/((?:password|passwd|secret|token|api[_-]?key)["']?\s*[:=]\s*["']?)[^\s"',]+/gi, "$1[REDACTED]");
}
