# Autonomia — Public acquisition site

Standalone Next.js public marketing application for **Autonomia — La force d’exécution IA**.

## Role

This app owns:
- public brand and conversion UX,
- Autonomia Experts and Autonomia Academy,
- SEO / GEO pages,
- Google Ads landing pages,
- Meta diagnostic funnels,
- progressive forms,
- attribution capture,
- forwarding normalized leads to Autonomia-MCP.

It does **not** own:
- opportunity deduplication,
- enrichment,
- scoring,
- assignment,
- next-best-action,
- pipeline revenue / margin analytics.

Those remain in Autonomia-MCP.

## Deployment boundary

The app lives in `site/` but is deployable as a separate Vercel project with `site` configured as the project root directory.

## Environment variables

- `NEXT_PUBLIC_SITE_URL`: canonical public URL.
- `AUTONOMIA_INBOUND_URL`: server-side Autonomia inbound ingestion endpoint.
- `AUTONOMIA_INBOUND_TOKEN`: secret token used only by the server route to forward leads.

Never expose the inbound token with a `NEXT_PUBLIC_` prefix.

## Acquisition model

All forms POST to `/api/leads`, which validates and forwards the normalized lead contract.

Captured browser attribution includes:
- landing page,
- referrer,
- UTM source / medium / campaign / content / term,
- campaign / ad set / ad / creative IDs when supplied,
- gclid / fbclid,
- immutable first-touch snapshot,
- bounded attribution history.

## Launch blockers

Before production publication:
1. connect the real Autonomia inbound endpoint;
2. add final legal notice and privacy policy;
3. validate the exact Qualiopi entity, wording and scope;
4. add only verified / authorized proof assets;
5. connect consent management before loading non-essential analytics or ad trackers;
6. set production domain and canonical URL;
7. verify GA4, Google Ads and Meta measurement with consent-aware implementation.
