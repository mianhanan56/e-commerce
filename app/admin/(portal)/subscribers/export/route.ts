import { getAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";

// Quotes every field and defuses spreadsheet formulas (=, +, -, @ at the start).
function csvField(value: string) {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });

  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("subscribers export failed", error);
    return new Response("Couldn't export subscribers", { status: 500 });
  }

  const rows = [["email", "joined_at"], ...(data ?? []).map((s) => [s.email, s.created_at])];
  const csv = rows.map((r) => r.map(csvField).join(",")).join("\r\n") + "\r\n";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(new Date());

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waqt-subscribers-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
