import fs from "fs";
import path from "path";

// On Vercel the function bundle is read-only; only /tmp is writable.
// Locally (vercel dev) we write to logs/api.log in the project root.
const IS_VERCEL = process.env.VERCEL === "1";
const LOG_FILE = IS_VERCEL
  ? "/tmp/api-logs.txt"
  : path.join(process.cwd(), "logs", "api.log");

function ensureDir() {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export type LogLevel = "INFO" | "WARN" | "ERROR";

export function log(
  fn: string,
  event: string,
  data?: Record<string, unknown>,
  level: LogLevel = "INFO"
) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    fn,
    event,
    ...(data ? { data } : {}),
  };

  // Always console.log — Vercel dashboard captures this.
  const prefix = `[${entry.ts}] [${level}] [${fn}]`;
  if (level === "ERROR") {
    console.error(prefix, event, data ?? "");
  } else {
    console.log(prefix, event, data ?? "");
  }

  // Write structured line to file.
  try {
    ensureDir();
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // Never let logging crash the handler.
  }
}
