import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  GITHUB_DEPLOY_AUDIENCE,
  validDeploySha,
  validateGitHubDeploymentClaims
} from "../lib/deploy/githubOidc.js";

const now = 2_000_000_000;
const valid = {
  iss: "https://token.actions.githubusercontent.com",
  aud: GITHUB_DEPLOY_AUDIENCE,
  repository: "aristote-app/Autonomia-MCP",
  ref: "refs/heads/main",
  workflow_ref:
    "aristote-app/Autonomia-MCP/.github/workflows/deploy-o2switch-self.yml@refs/heads/main",
  event_name: "workflow_run",
  iat: now - 10,
  nbf: now - 10,
  exp: now + 300
};

assert.equal(validateGitHubDeploymentClaims(valid, { nowSeconds: now }).ok, true);
assert.equal(
  validateGitHubDeploymentClaims({ ...valid, repository: "evil/repo" }, { nowSeconds: now }).reason,
  "repository"
);
assert.equal(
  validateGitHubDeploymentClaims({ ...valid, ref: "refs/heads/feature" }, { nowSeconds: now }).reason,
  "ref"
);
assert.equal(
  validateGitHubDeploymentClaims({ ...valid, aud: "wrong" }, { nowSeconds: now }).reason,
  "audience"
);
assert.equal(
  validateGitHubDeploymentClaims({ ...valid, exp: now - 100 }, { nowSeconds: now }).reason,
  "expired"
);
assert.equal(validDeploySha("a".repeat(40)), true);
assert.equal(validDeploySha("main"), false);

const healthRoute = await readFile(
  new URL("../app/api/health/route.js", import.meta.url),
  "utf8"
);
const deployScript = await readFile(
  new URL("./o2switch-sync-cockpit.sh", import.meta.url),
  "utf8"
);

assert.equal(
  healthRoute.includes('buildStamp.generated.js'),
  true,
  "Health must report the SHA embedded in the running build"
);
assert.equal(
  deployScript.includes('AUTONOMIA_DEPLOY_SHA="$REMOTE_SHA" npm run build'),
  true,
  "o2switch deployment must inject the validated target SHA into the isolated candidate build"
);
assert.equal(
  deployScript.includes('cp "$STAGE_ROOT/lib/runtime/buildStamp.generated.js" "$APP_ROOT/lib/runtime/buildStamp.generated.js"'),
  true,
  "o2switch deployment must publish the candidate build stamp only after a successful build"
);
assert.equal(
  deployScript.includes('git archive "$REMOTE_SHA" | tar -x -C "$STAGE_ROOT"'),
  true,
  "o2switch deployment must build the target commit outside the live Passenger tree"
);
assert.equal(
  deployScript.includes('> .runtime/deployed-sha'),
  false,
  "A mutable runtime file must not masquerade as the running build SHA"
);

console.log("github oidc deploy smoke ok");
