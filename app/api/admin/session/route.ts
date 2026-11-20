// Tells the browser whether you're logged in, so public pages can stay static
// and only show the "+" button to you.

import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await isAdmin();
  return Response.json({ admin }, { headers: { "Cache-Control": "no-store" } });
}
