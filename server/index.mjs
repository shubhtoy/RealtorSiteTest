import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "./env.mjs";
import {
  bootstrapContent,
  getDraftDocument,
  getPublishedDocument,
  publishDraftDocument,
  setDraftDocument,
} from "./content-store.mjs";

const app = express();
const PORT = env.apiPort;
const STUDIO_PASSWORD = env.studioPassword;
const uploadDir = path.resolve(process.cwd(), "public/uploads");

app.use(express.json({ limit: "2mb" }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const baseName = (path.basename(file.originalname || "upload", ext) || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    cb(null, `${baseName || "upload"}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    const allowedMime = /^image\//.test(file.mimetype);
    const allowedExt = /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.originalname || "");
    cb(null, allowedMime || allowedExt);
  },
});

function parseHeadersJson(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return Object.entries(parsed).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {});
  } catch {
    return {};
  }
}

function renderTemplate(template, form) {
  return String(template ?? "")
    .replace(/\{\{fullName\}\}/g, String(form.fullName ?? ""))
    .replace(/\{\{email\}\}/g, String(form.email ?? ""))
    .replace(/\{\{phone\}\}/g, String(form.phone ?? ""))
    .replace(/\{\{bedroom\}\}/g, String(form.bedroom ?? ""))
    .replace(/\{\{moveIn\}\}/g, String(form.moveIn ?? ""))
    .replace(/\{\{tourType\}\}/g, String(form.tourType ?? ""));
}

let cachedTransport = null;
function getSmtpTransport() {
  if (cachedTransport) return cachedTransport;

  if (!env.smtpHost || !env.smtpPort) {
    return null;
  }

  cachedTransport = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth:
      env.smtpUser && env.smtpPass
        ? {
            user: env.smtpUser,
            pass: env.smtpPass,
          }
        : undefined,
  });

  return cachedTransport;
}

function requireStudioAuth(req, res, next) {
  const provided = req.header("x-studio-password") ?? "";
  if (!provided || provided !== STUDIO_PASSWORD) {
    res.status(401).json({ ok: false, message: "Unauthorized" });
    return;
  }
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "baba-flats-api" });
});

app.get("/api/content/draft", requireStudioAuth, async (_req, res) => {
  const draft = await getDraftDocument();
  if (!draft) {
    res.status(404).json({ ok: false, message: "Draft not initialized" });
    return;
  }

  res.json({ ok: true, data: draft });
});

app.get("/api/content/published", requireStudioAuth, async (_req, res) => {
  const published = await getPublishedDocument();
  if (!published) {
    res.status(404).json({ ok: false, message: "Published document not initialized" });
    return;
  }

  res.json({ ok: true, data: published });
});

app.post("/api/content/bootstrap", requireStudioAuth, async (req, res) => {
  const { document } = req.body ?? {};
  if (!document || typeof document !== "object") {
    res.status(400).json({ ok: false, message: "document object is required" });
    return;
  }

  const result = await bootstrapContent(document);
  res.json({ ok: true, data: result });
});

app.put("/api/content/draft", requireStudioAuth, async (req, res) => {
  const { document } = req.body ?? {};
  if (!document || typeof document !== "object") {
    res.status(400).json({ ok: false, message: "document object is required" });
    return;
  }

  const updated = await setDraftDocument(document);
  res.json({ ok: true, data: updated });
});

app.post("/api/content/publish", requireStudioAuth, async (_req, res) => {
  try {
    const published = await publishDraftDocument();
    res.json({ ok: true, data: published });
  } catch (error) {
    res.status(400).json({ ok: false, message: error instanceof Error ? error.message : "Publish failed" });
  }
});

app.post("/api/assets/upload", requireStudioAuth, async (req, res) => {
  await fs.mkdir(uploadDir, { recursive: true });

  upload.array("files")(req, res, (error) => {
    if (error) {
      res.status(400).json({ ok: false, message: error instanceof Error ? error.message : "Upload failed" });
      return;
    }

    const files = Array.isArray(req.files) ? req.files : [];
    const payload = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    }));

    res.json({ ok: true, files: payload });
  });
});

app.post("/api/contact/submit", async (req, res) => {
  const { form, submittedAt, page, siteName, integrations } = req.body ?? {};

  if (!form || typeof form !== "object") {
    res.status(400).json({ ok: false, message: "form payload is required" });
    return;
  }

  const payload = {
    form,
    submittedAt: submittedAt ?? new Date().toISOString(),
    page: page ?? "contact",
    siteName: siteName ?? "Website",
  };

  const smtpResult = { attempted: false, success: false, mode: "none", error: null };
  const hookResults = [];

  const smtpConfig = integrations?.smtp ?? {};
  if (smtpConfig.enabled) {
    smtpResult.attempted = true;

    const transporter = getSmtpTransport();
    if (transporter) {
      try {
        const fromAddress = smtpConfig.fromEmail || env.smtpFrom;
        const toAddress = smtpConfig.toEmail || env.smtpTo;
        const subject = renderTemplate(
          smtpConfig.subjectTemplate || "New Tour Request - {{fullName}}",
          payload.form,
        );

        if (!fromAddress || !toAddress) {
          throw new Error("SMTP from/to address missing");
        }

        await transporter.sendMail({
          from: fromAddress,
          to: toAddress,
          subject,
          text: JSON.stringify(payload, null, 2),
        });

        smtpResult.success = true;
        smtpResult.mode = "smtp-transport";
      } catch (error) {
        smtpResult.error = error instanceof Error ? error.message : "SMTP send failed";
      }
    } else if (smtpConfig.endpoint) {
      try {
        const headers = { "Content-Type": "application/json" };
        if (smtpConfig.authHeader) {
          headers.Authorization = String(smtpConfig.authHeader);
        }

        const response = await fetch(String(smtpConfig.endpoint), {
          method: String(smtpConfig.method || "POST"),
          headers,
          body: JSON.stringify({
            channel: "smtp",
            fromEmail: smtpConfig.fromEmail,
            toEmail: smtpConfig.toEmail,
            subject: renderTemplate(
              smtpConfig.subjectTemplate || "New Tour Request - {{fullName}}",
              payload.form,
            ),
            payload,
          }),
        });

        if (!response.ok) {
          throw new Error(`SMTP endpoint returned ${response.status}`);
        }

        smtpResult.success = true;
        smtpResult.mode = "smtp-endpoint";
      } catch (error) {
        smtpResult.error = error instanceof Error ? error.message : "SMTP endpoint failed";
      }
    } else {
      smtpResult.error = "SMTP enabled but no transport config or endpoint is available";
    }
  }

  const hooks = Array.isArray(integrations?.submitHooks) ? integrations.submitHooks : [];
  for (const hook of hooks) {
    if (!hook?.enabled || !hook?.url) continue;

    const headers = {
      "Content-Type": "application/json",
      ...parseHeadersJson(hook.headersJson),
    };

    try {
      const response = await fetch(String(hook.url), {
        method: String(hook.method || "POST"),
        headers,
        body: JSON.stringify(
          hook.sendFormData
            ? payload
            : {
                submittedAt: payload.submittedAt,
                siteName: payload.siteName,
                source: payload.page,
              },
        ),
      });

      hookResults.push({
        name: hook.name || "Hook",
        url: hook.url,
        success: response.ok,
        status: response.status,
      });
    } catch (error) {
      hookResults.push({
        name: hook.name || "Hook",
        url: hook.url,
        success: false,
        error: error instanceof Error ? error.message : "Hook failed",
      });
    }
  }

  const hookFailures = hookResults.filter((item) => !item.success).length;
  const smtpFailed = smtpResult.attempted && !smtpResult.success;
  const totalFailures = hookFailures + (smtpFailed ? 1 : 0);

  const status = totalFailures > 0 ? 207 : 200;
  res.status(status).json({
    ok: totalFailures === 0,
    message: totalFailures === 0 ? "Submission delivered" : "Submission saved with partial delivery failures",
    smtp: smtpResult,
    hooks: hookResults,
  });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
