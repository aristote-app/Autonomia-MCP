import assert from "node:assert/strict";
import { RUNTIME_INTEGRATION_KEYS } from "../lib/runtime/integrationSettings.js";

assert.ok(RUNTIME_INTEGRATION_KEYS.includes("KASPR_API_KEY"));
assert.ok(RUNTIME_INTEGRATION_KEYS.includes("WAALAXY_API_KEY"));
assert.ok(RUNTIME_INTEGRATION_KEYS.includes("AUTONOMIA_ACCOUNT_RESEARCH_ENABLED"));
assert.equal(RUNTIME_INTEGRATION_KEYS.includes("SUPABASE_SECRET_KEY"), false);
assert.equal(RUNTIME_INTEGRATION_KEYS.includes("AUTONOMIA_INTERNAL_TOKEN"), false);

console.log("runtime integration settings smoke ok");
