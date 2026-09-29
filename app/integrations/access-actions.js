"use server";

import { redirect } from "next/navigation";
import {
  grantTemporaryIntegrationsAccess,
  validTemporaryIntegrationsCode
} from "../../lib/integrations/access.js";

export async function unlockIntegrationsAccessAction(formData) {
  const code = String(formData.get("access_code") || "").trim();

  if (!validTemporaryIntegrationsCode(code)) {
    redirect("/integrations?access=invalid#connection-settings");
  }

  await grantTemporaryIntegrationsAccess();
  redirect("/integrations#connection-settings");
}
