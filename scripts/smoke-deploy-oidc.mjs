import assert from "node:assert/strict";
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

console.log("github oidc deploy smoke ok");
