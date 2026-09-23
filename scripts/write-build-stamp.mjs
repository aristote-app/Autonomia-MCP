import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "lib", "runtime", "buildStamp.generated.js");

function resolveSha() {
  const explicit = String(
    process.env.AUTONOMIA_DEPLOY_SHA ||
    process.env.GITHUB_SHA ||
    ""
  ).trim();

  if (/^[a-f0-9]{40}$/i.test(explicit)) return explicit;

  try {
    const gitSha = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    if (/^[a-f0-9]{40}$/i.test(gitSha)) return gitSha;
  } catch {}

  return "development";
}

const sha = resolveSha();
await mkdir(dirname(target), { recursive: true });
await writeFile(
  target,
  `// Generated automatically before Next.js build.\nexport const BUILD_SHA = ${JSON.stringify(sha)};\n`,
  "utf8"
);

console.log(`[build-stamp] BUILD_SHA=${sha}`);
