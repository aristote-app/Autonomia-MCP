import { drainInboundSpool, listQueuedInboundLeads } from "../lib/inbound/spool.js";

try {
  const before = await listQueuedInboundLeads({ limit: 500 });
  const result = await drainInboundSpool({ limit: 50, timeoutMs: 8000 });
  const after = await listQueuedInboundLeads({ limit: 500 });

  console.log(JSON.stringify({
    ok: true,
    queued_before: before.length,
    processed: result.processed,
    failed: result.failed,
    queued_after: after.length,
    timestamp: new Date().toISOString()
  }));
} catch (error) {
  console.error(JSON.stringify({
    ok: false,
    error: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString()
  }));
  process.exitCode = 1;
}
