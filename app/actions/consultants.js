"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { bulkUpsertConsultants } from "../../lib/db/consultants.js";
import { parseConsultantImportText } from "../../lib/consultants/import.js";

const IMPORT_ROLES = new Set(["admin", "direction", "staffing"]);

async function requireImporter() {
  const context = await getCurrentWorkspaceMembership();

  if (
    !context.configured ||
    !context.claims?.sub ||
    !context.membership ||
    !IMPORT_ROLES.has(context.membership.role)
  ) {
    throw new Error("Consultant import access required");
  }

  return context;
}

export async function importConsultantsFromText(formData) {
  const context = await requireImporter();
  const rows = parseConsultantImportText(formData.get("rows"), { maxRows: 200 });

  if (!rows.length) {
    throw new Error("Aucun consultant valide à importer");
  }

  const result = await bulkUpsertConsultants(rows, {
    actorUserId: context.claims.sub
  });

  revalidatePath("/consultants");
  revalidatePath("/");

  redirect(
    "/consultants?imported=" +
      encodeURIComponent(String(result.imported)) +
      "&skills=" +
      encodeURIComponent(String(result.skill_links))
  );
}
