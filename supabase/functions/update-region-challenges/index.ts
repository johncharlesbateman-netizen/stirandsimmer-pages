import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_REGIONS = new Set(["uk", "italy", "france", "asia"]);

type Update = { region_id: string; challenge: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is an authenticated admin.
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client scoped to the caller's JWT — used to resolve the user.
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: "Unauthorized" }, 401);
    }

    // Service-role client — bypasses RLS for is_admin check and writes.
    const admin = createClient(supabaseUrl, serviceKey);

    const email = userData.user.email?.toLowerCase() ?? "";
    let allowed = false;
    if (email) {
      const { data: match } = await admin
        .from("admin_emails")
        .select("email")
        .ilike("email", email)
        .maybeSingle();
      allowed = !!match;
    }

    if (!allowed) {
      return json({ error: "Forbidden" }, 403);
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return json({ error: "Invalid body" }, 400);
    }

    const { updates } = body as { updates?: unknown };

    if (!Array.isArray(updates) || updates.length === 0) {
      return json({ error: "No updates provided" }, 400);
    }

    const cleaned: Update[] = [];
    for (const u of updates as Update[]) {
      if (
        !u ||
        typeof u.region_id !== "string" ||
        typeof u.challenge !== "string" ||
        !ALLOWED_REGIONS.has(u.region_id) ||
        u.challenge.trim().length === 0 ||
        u.challenge.length > 2000
      ) {
        return json({ error: "Invalid update entry" }, 400);
      }
      cleaned.push({ region_id: u.region_id, challenge: u.challenge.trim() });
    }

    const { data: existing, error: existingError } = await admin
      .from("region_challenges")
      .select("region_id, challenge")
      .in("region_id", cleaned.map((u) => u.region_id));

    if (existingError) {
      console.error("read existing error", existingError);
      return json({ error: existingError.message }, 500);
    }

    const existingById = new Map(
      (existing ?? []).map((r) => [r.region_id, r.challenge as string]),
    );

    const now = new Date().toISOString();

    const historyRows = cleaned
      .filter((u) => {
        const prev = existingById.get(u.region_id);
        return prev !== undefined && prev.trim() !== u.challenge.trim();
      })
      .map((u) => ({
        region_id: u.region_id,
        challenge: existingById.get(u.region_id)!,
        replaced_at: now,
      }));

    if (historyRows.length > 0) {
      const { error: historyError } = await admin
        .from("region_challenge_history")
        .insert(historyRows);
      if (historyError) {
        console.error("history insert error", historyError);
        return json({ error: historyError.message }, 500);
      }
    }

    const rows = cleaned.map((u) => ({
      region_id: u.region_id,
      challenge: u.challenge,
      updated_at: now,
    }));

    const { error } = await admin
      .from("region_challenges")
      .upsert(rows, { onConflict: "region_id" });

    if (error) {
      console.error("upsert error", error);
      return json({ error: error.message }, 500);
    }

    return json({ ok: true, updated_at: now, count: rows.length });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message ?? "Unknown error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
