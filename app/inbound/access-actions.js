"use server";

import { redirect } from "next/navigation";
import {
  grantTemporaryInboundAccess,
  validTemporaryInboundCode
} from "../../lib/inbound/access.js";

export async function unlockInboundAccessAction(formData) {
  const code = String(formData.get("access_code") || "").trim();

  if (!validTemporaryInboundCode(code)) {
    redirect("/inbound?access=invalid");
  }

  await grantTemporaryInboundAccess();
  redirect("/inbound");
}
