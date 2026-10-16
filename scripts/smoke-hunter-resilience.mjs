import assert from "node:assert/strict";
import { safeHunterError } from "../app/api/internal/opportunity-hunter-refresh/route.js";

assert.deepEqual(safeHunterError({code:"PGRST116",message:"Private contact: alice@example.com"}),{
  code:"PGRST116",category:"provider_or_database"
});
assert.deepEqual(safeHunterError(new Error("Authorization: secret-value")),{
  code:"UNEXPECTED_ERROR",category:"unexpected"
});
assert.deepEqual(safeHunterError({code:"x".repeat(150),details:"Access token"}),{
  code:"UNEXPECTED_ERROR",category:"provider_or_database"
});
assert.deepEqual(safeHunterError({name:"AbortError",message:"Sensitive URL"}),{
  code:"UNEXPECTED_ERROR",category:"timeout"
});
console.log("Opportunity Hunter private-data redaction and error categorization passed");
