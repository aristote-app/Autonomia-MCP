import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { z } from "zod";

const Input = z.object({
  email: z.string().email(),
  first_name: z.string().max(160).nullable().optional(),
  machine_id: z.string().min(1).max(120),
  kit_markdown: z.string().min(20).max(120000)
});

function safeHeader(value = "") {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(value = "") {
  return "=?UTF-8?B?" + Buffer.from(String(value), "utf8").toString("base64") + "?=";
}

function buildMessage({ email, first_name, machine_id, kit_markdown }) {
  const boundary = "autonomia-" + Date.now().toString(36);
  const attachment = Buffer.from(kit_markdown, "utf8").toString("base64").replace(/(.{76})/g, "$1\r\n");
  const name = safeHeader(first_name || "");
  const recipient = safeHeader(email);
  const filename = "AUTONOMIA-kit-machine-IA-email.md";
  const subject = "Votre kit AUTONOMIA — Machine IA";
  const hello = name ? "Bonjour " + name + "," : "Bonjour,";
  const messageId = "<autonomia-kit-" + Date.now() + "-" + Math.random().toString(36).slice(2) + "@build-autonomia.com>";
  const dateHeader = new Date().toUTCString();

  const text = [
    hello,
    "",
    "Votre kit AUTONOMIA est prêt.",
    "",
    "Vous trouverez en pièce jointe votre configuration complète : architecture, plan de mise en place, script de départ, tests et garde-fous.",
    "",
    "Le mode le plus simple :",
    "1. Téléchargez la pièce jointe .md.",
    "2. Ouvrez Claude ou ChatGPT.",
    "3. Uploadez directement le fichier complet dans la conversation.",
    "4. Écrivez simplement : START",
    "5. L’IA vous guide ensuite une étape à la fois jusqu’au test final.",
    "",
    "Si une étape bloque, envoyez à l’IA la capture d’écran ou l’erreur exacte. Le kit contient un mode installateur prévu pour rester sur l’étape jusqu’à résolution.",
    "",
    "Machine : " + machine_id,
    "",
    "Si vous préférez qu’AUTONOMIA construise la machine avec vous :",
    "https://calendly.com/deborah-build-autonomia/30min",
    "",
    "Déborah Dian Goldcher",
    "AUTONOMIA — TROUVER · CONSTRUIRE · FORMER",
    "https://build-autonomia.com"
  ].join("\r\n");

  return [
    "From: AUTONOMIA <deborah@build-autonomia.com>",
    "To: " + recipient,
    "Reply-To: deborah@build-autonomia.com",
    "Subject: " + encodeHeader(subject),
    "Date: " + dateHeader,
    "Message-ID: " + messageId,
    "Auto-Submitted: auto-generated",
    "X-Auto-Response-Suppress: All",
    "MIME-Version: 1.0",
    "Content-Type: multipart/mixed; boundary=\"" + boundary + "\"",
    "X-AUTONOMIA-Machine: " + safeHeader(machine_id),
    "",
    "--" + boundary,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    "--" + boundary,
    "Content-Type: text/markdown; name=\"" + filename + "\"",
    "Content-Disposition: attachment; filename=\"" + filename + "\"",
    "Content-Transfer-Encoding: base64",
    "",
    attachment,
    "",
    "--" + boundary + "--",
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
      await sendWithRetry(message);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 350));
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
    await sendWithLocalMta(message);

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
