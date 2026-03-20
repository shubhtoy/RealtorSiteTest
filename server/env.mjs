import "dotenv/config";

const DEFAULTS = {
  apiPort: 8787,
  smtpSecure: false,
};

function clean(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  const next = value.trim();
  return next.length > 0 ? next : fallback;
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  return fallback;
}

export const env = {
  apiPort: toNumber(process.env.API_PORT, DEFAULTS.apiPort),
  studioPassword: clean(
    process.env.STUDIO_PASSWORD || process.env.VITE_STUDIO_PASSWORD,
    "",
  ),
  smtpHost: clean(process.env.SMTP_HOST),
  smtpPort: toNumber(process.env.SMTP_PORT, 587),
  smtpSecure: toBoolean(process.env.SMTP_SECURE, DEFAULTS.smtpSecure),
  smtpUser: clean(process.env.SMTP_USER),
  smtpPass: clean(process.env.SMTP_PASS),
  smtpFrom: clean(process.env.SMTP_FROM),
  smtpTo: clean(process.env.SMTP_TO),
};

export function validateRequiredEnv() {
  const missing = [];
  if (!env.studioPassword) missing.push("STUDIO_PASSWORD");
  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
      `Set them in your .env file or environment before starting the server.`,
    );
    process.exit(1);
  }
}
