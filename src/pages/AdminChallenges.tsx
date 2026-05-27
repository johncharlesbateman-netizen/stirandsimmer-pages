import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const REGIONS: { id: string; name: string; emoji: string }[] = [
  { id: "uk", name: "United Kingdom", emoji: "🇬🇧" },
  { id: "italy", name: "Italy", emoji: "🇮🇹" },
  { id: "france", name: "France", emoji: "🇫🇷" },
  { id: "asia", name: "South and Southeast Asia", emoji: "🌶️" },
];

type Row = { region_id: string; challenge: string; updated_at: string };
type HistoryRow = { region_id: string; challenge: string; replaced_at: string };

const AdminChallenges = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "region-challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("region_challenges")
        .select("region_id, challenge, updated_at");
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ["admin", "region-challenge-history"],
    queryFn: async () => {
      const fourWeeksAgo = new Date(
        Date.now() - 28 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { data, error } = await supabase
        .from("region_challenge_history")
        .select("region_id, challenge, replaced_at")
        .gte("replaced_at", fourWeeksAgo)
        .order("replaced_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as HistoryRow[];
    },
  });

  const historyByRegion = REGIONS.reduce<Record<string, HistoryRow[]>>(
    (acc, r) => {
      acc[r.id] = history.filter((h) => h.region_id === r.id);
      return acc;
    },
    {},
  );

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const r of rows) initial[r.region_id] = r.challenge;
    setDrafts((prev) => ({ ...initial, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length]);

  const byId = Object.fromEntries(rows.map((r) => [r.region_id, r])) as Record<
    string,
    Row | undefined
  >;

  const handleSaveAll = async () => {
    const updates = REGIONS.map((r) => ({
      region_id: r.id,
      challenge: (drafts[r.id] ?? "").trim(),
    }));

    const empty = updates.find((u) => !u.challenge);
    if (empty) {
      const region = REGIONS.find((r) => r.id === empty.region_id);
      toast({
        title: "Challenge text required",
        description: `Please enter text for ${region?.name}.`,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { data, error } = await supabase.functions.invoke(
      "update-region-challenges",
      { body: { updates } },
    );
    setSaving(false);

    if (error || (data && (data as { error?: string }).error)) {
      const message =
        (data as { error?: string } | undefined)?.error ??
        error?.message ??
        "Couldn't save changes.";
      toast({
        title: "Couldn't save",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setSavedAt(new Date());
    toast({ title: "Challenges updated successfully" });
    queryClient.invalidateQueries({ queryKey: ["admin", "region-challenges"] });
    queryClient.invalidateQueries({
      queryKey: ["admin", "region-challenge-history"],
    });
    REGIONS.forEach((r) =>
      queryClient.invalidateQueries({ queryKey: ["region-challenge", r.id] }),
    );
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "Never";
    try {
      return new Date(iso).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  const anyDirty = REGIONS.some((r) => {
    const draft = (drafts[r.id] ?? "").trim();
    const original = (byId[r.id]?.challenge ?? "").trim();
    return draft !== original;
  });

  return (
    <Layout>
      <Helmet>
        <title>Manage weekly challenges | Stir & Simmer admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="py-10 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl">
          <p className="micro-caption mb-3">Admin</p>
          <h1 className="heading-display mb-3">Weekly challenges</h1>
          <p className="text-muted-foreground">
            Edit the challenge text for each active region. Changes go live on
            The Kitchen Atlas as soon as you save.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl space-y-6 md:space-y-8">
          {isLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <>
              {REGIONS.map((region) => {
                const row = byId[region.id];
                const draft = drafts[region.id] ?? "";
                return (
                  <div
                    key={region.id}
                    className="border border-border rounded-lg p-5 md:p-6 bg-card"
                  >
                    <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                      <span className="text-2xl" aria-hidden>
                        {region.emoji}
                      </span>
                      <h2 className="font-display text-xl md:text-2xl text-foreground">
                        {region.name}
                      </h2>
                    </div>

                    <Label
                      htmlFor={`challenge-${region.id}`}
                      className="text-xs uppercase tracking-widest font-semibold text-muted-foreground"
                    >
                      Challenge
                    </Label>
                    <Textarea
                      id={`challenge-${region.id}`}
                      value={draft}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [region.id]: e.target.value,
                        }))
                      }
                      rows={4}
                      className="mt-2"
                    />

                    <p className="text-xs text-muted-foreground mt-3">
                      Last updated: {formatDate(row?.updated_at)}
                    </p>

                    {historyByRegion[region.id]?.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-border">
                        <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
                          Last 4 weeks
                        </p>
                        <ul className="space-y-3">
                          {historyByRegion[region.id].slice(0, 4).map((h) => (
                            <li
                              key={`${h.region_id}-${h.replaced_at}`}
                              className="text-sm"
                            >
                              <p className="text-foreground whitespace-pre-wrap">
                                {h.challenge}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Replaced {formatDate(h.replaced_at)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="sticky bottom-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border border-border rounded-lg p-4 md:p-5 shadow-md">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="text-sm text-muted-foreground">
                    {savedAt ? (
                      <span className="text-foreground font-medium">
                        ✓ Challenges updated successfully
                      </span>
                    ) : anyDirty ? (
                      "You have unsaved changes."
                    ) : (
                      "No changes to save."
                    )}
                  </div>
                  <Button
                    onClick={handleSaveAll}
                    disabled={saving || !anyDirty}
                    size="lg"
                    className="min-h-[44px]"
                  >
                    {saving ? "Saving…" : "Save all challenges"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminChallenges;
