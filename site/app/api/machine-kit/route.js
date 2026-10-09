import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { z } from "zod";

const Input = z.object({
  email: z.string().email(),
  first_name: z.string().max(160).nullable().optional(),
  machine_id: z.string().min(1).max(120),
  machine_name: z.string().min(1).max(180).optional(),
  machine_slug: z.string().min(1).max(180).optional(),
  kit_markdown: z.string().min(20).max(120000)
});

function safeHeader(value = "") {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(value = "") {
  return "=?UTF-8?B?" + Buffer.from(String(value), "utf8").toString("base64") + "?=";
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeSlug(value = "") {
  return String(value || "machine-ia")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "machine-ia";
}

function chunkBase64(value) {
  return value.replace(/(.{76})/g, "$1\r\n");
}

function buildText({ hello, machineName, machineUrl }) {
  return [
    hello,
    "",
    "Votre kit AUTONOMIA est prêt.",
    "",
    "Machine : " + machineName,
    "",
    "Le mode le plus simple :",
    "1. Téléchargez la pièce jointe .md.",
    "2. Ouvrez Claude ou ChatGPT.",
    "3. Uploadez directement le fichier complet dans la conversation.",
    "4. Écrivez simplement : START",
    "5. L’IA vous guide ensuite une étape à la fois jusqu’au test final.",
    "",
    "Le kit contient votre architecture, vos choix d’outils, vos règles de validation humaine, un script de départ, les tests à effectuer et le mode installateur.",
    "",
    "Reprendre la machine : " + machineUrl,
    "",
    "Vous préférez qu’AUTONOMIA la construise avec vous ?",
    "https://calendly.com/deborah-build-autonomia/30min",
    "",
    "Déborah Dian Goldcher",
    "AUTONOMIA — TROUVER · CONSTRUIRE · FORMER",
    "https://build-autonomia.com"
  ].join("\r\n");
}

function buildHtml({ hello, machineName, machineUrl, linkedinUrl }) {
  const safeHello = escapeHtml(hello);
  const safeMachineName = escapeHtml(machineName);
  const safeMachineUrl = escapeHtml(machineUrl);
  const safeLinkedinUrl = escapeHtml(linkedinUrl);

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef2f5;font-family:Arial,Helvetica,sans-serif;color:#07111f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f5;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dce2e7;">
            <tr>
              <td style="background:#07111f;padding:26px 30px 24px;">
                <div style="font-size:12px;font-weight:800;letter-spacing:.18em;color:#3de2d0;">AUTONOMIA</div>
                <div style="margin-top:8px;font-size:11px;letter-spacing:.08em;color:#b8c5d4;">TROUVER · CONSTRUIRE · FORMER</div>
              </td>
            </tr>

            <tr>
              <td style="padding:34px 30px 18px;">
                <div style="font-size:13px;color:#536071;">${safeHello}</div>
                <h1 style="margin:10px 0 12px;font-size:34px;line-height:1.02;letter-spacing:-.04em;color:#07111f;">
                  Votre kit AUTONOMIA est prêt.
                </h1>
                <p style="margin:0;font-size:16px;line-height:1.55;color:#536071;">
                  <strong style="color:#07111f;">${safeMachineName}</strong><br>
                  Votre configuration complète est jointe à cet e-mail.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 30px 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f8fa;border-radius:14px;border:1px solid #e1e6ea;">
                  <tr>
                    <td style="padding:22px;">
                      <div style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#0b8f82;">LE PLUS SIMPLE</div>
                      <ol style="margin:12px 0 0;padding-left:20px;color:#243244;font-size:14px;line-height:1.65;">
                        <li>Téléchargez la pièce jointe <strong>.md</strong>.</li>
                        <li>Ouvrez <strong>Claude</strong> ou <strong>ChatGPT</strong>.</li>
                        <li>Uploadez directement le fichier complet dans la conversation.</li>
                        <li>Écrivez simplement <strong>START</strong>.</li>
                        <li>L’IA vous guide une seule étape à la fois jusqu’au test final.</li>
                      </ol>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:10px 30px 24px;">
                <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:#657283;">
                  Le kit contient votre architecture, vos règles métier, les validations humaines,
                  le script de départ, les tests et un mode installateur prévu pour rester sur une étape
                  tant qu’elle n’est pas validée.
                </p>
                <a href="${safeMachineUrl}" style="display:inline-block;background:#3de2d0;color:#07111f;text-decoration:none;font-size:13px;font-weight:800;padding:13px 18px;border-radius:9px;">
                  Reprendre ma machine →
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 30px;background:#07111f;">
                <div style="font-size:11px;font-weight:800;letter-spacing:.09em;color:#3de2d0;">ALLER PLUS LOIN</div>
                <p style="margin:8px 0 16px;font-size:14px;line-height:1.5;color:#d6e0eb;">
                  Vous préférez qu’AUTONOMIA construise cette machine avec vous ?
                </p>
                <a href="https://calendly.com/deborah-build-autonomia/30min" style="display:inline-block;background:#ffffff;color:#07111f;text-decoration:none;font-size:12px;font-weight:800;padding:11px 15px;border-radius:8px;">
                  Parler de cette machine →
                </a>
                <span style="display:inline-block;width:8px;"></span>
                <a href="${safeLinkedinUrl}" style="display:inline-block;color:#ffffff;text-decoration:underline;font-size:12px;font-weight:700;padding:11px 0;">
                  Suivre les prochaines machines sur LinkedIn
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 30px;background:#ffffff;color:#788391;font-size:11px;line-height:1.5;">
                Déborah Dian Goldcher · AUTONOMIA<br>
                Cet e-mail vous est envoyé parce que vous avez demandé votre kit Machine Builder.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildMessage({ email, first_name, machine_id, machine_name, machine_slug, kit_markdown }) {
  const mixedBoundary = "autonomia-mixed-" + Date.now().toString(36);
  const altBoundary = "autonomia-alt-" + Math.random().toString(36).slice(2);
  const name = safeHeader(first_name || "");
  const recipient = safeHeader(email);
  const machineName = safeHeader(machine_name || machine_id);
  const slug = safeSlug(machine_slug || machine_id);
  const filename = "AUTONOMIA-kit-machine-IA-" + slug + ".md";
  const subject = "Votre kit AUTONOMIA — Machine IA — " + machineName;
  const hello = name ? "Bonjour " + name + "," : "Bonjour,";
  const messageId = "<autonomia-kit-" + Date.now() + "-" + Math.random().toString(36).slice(2) + "@build-autonomia.com>";
  const dateHeader = new Date().toUTCString();
  const machineUrl = "https://build-autonomia.com/machine-builder/" + slug;
  const linkedinUrl =
    process.env.NEXT_PUBLIC_LINKEDIN_NEWSLETTER_URL ||
    "https://www.linkedin.com/in/deborahdiangoldcher/";

  const text = buildText({ hello, machineName, machineUrl });
  const html = buildHtml({ hello, machineName, machineUrl, linkedinUrl });
  const attachment = chunkBase64(Buffer.from(kit_markdown, "utf8").toString("base64"));

  return [
    "From: AUTONOMIA <deborah@build-autonomia.com>",
    "To: " + recipient,
    "Reply-To: deborah@build-autonomia.com",
    "Subject: " + encodeHeader(subject),
    "Date: " + dateHeader,
    "Message-ID: " + messageId,
    "Auto-Submitted: auto-generated",
    "X-Auto-Response-Suppress: All",
    "X-AUTONOMIA-Machine: " + safeHeader(machine_id),
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="' + mixedBoundary + '"',
    "",
    "--" + mixedBoundary,
    'Content-Type: multipart/alternative; boundary="' + altBoundary + '"',
    "",
    "--" + altBoundary,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    "--" + altBoundary,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    "--" + altBoundary + "--",
    "",
    "--" + mixedBoundary,
    'Content-Type: text/markdown; name="' + filename + '"',
    'Content-Disposition: attachment; filename="' + filename + '"',
    "Content-Transfer-Encoding: base64",
    "",
    attachment,
    "",
    "--" + mixedBoundary + "--",
    ""
  ].join("\r\n");
}

function sendWithLocalMta(message) {
  const sendmailPath = process.env.AUTONOMIA_SENDMAIL_PATH || "/usr/sbin/sendmail";

  return new Promise((resolve, reject) => {
    const child = spawn(sendmailPath, ["-t", "-i", "-f", "deborah@build-autonomia.com"], {
      stdio: ["pipe", "ignore", "pipe"]
    });

    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("sendmail_timeout"));
    }, 12000);

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("sendmail_exit_" + code + (stderr ? ": " + stderr.slice(0, 600) : "")));
      }
    });

    child.stdin.end(message, "utf8");
  });
}

async function sendWithRetry(message, attempts = 2) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await sendWithLocalMta(message);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  }

  throw lastError || new Error("email_delivery_failed");
}

export async function POST(request) {
  let input;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Input.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const message = buildMessage(parsed.data);
    await sendWithRetry(message);

    return NextResponse.json(
      { accepted: true, delivered_to_mta: true },
      { status: 202 }
    );
  } catch (error) {
    console.error("AUTONOMIA machine kit email failed", {
      error: error?.message || String(error)
    });

    return NextResponse.json(
      { error: "email_delivery_failed" },
      { status: 503 }
    );
  }
}
