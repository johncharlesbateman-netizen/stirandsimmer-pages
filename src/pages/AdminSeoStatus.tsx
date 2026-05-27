import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { categoryLabels } from "@/lib/recipe-utils";
import {
  AuditResult,
  AuditableRecipe,
  DESC_LIMIT,
  REQUIRED_SCHEMA_FIELDS,
  TITLE_LIMIT,
  auditRecipe,
  findDuplicates,
} from "@/lib/seo-audit";

type StatusFilter = "all" | "passing" | "failing";
type SortKey = "title" | "category" | "status" | "schema" | "title_len" | "desc_len";
type SortDir = "asc" | "desc";

const StatusPill = ({ ok }: { ok: boolean }) =>
  ok ? (
    <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
      <CheckCircle2 className="w-3 h-3 mr-1" /> Passing
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-destructive/15 text-destructive border-destructive/30">
      <XCircle className="w-3 h-3 mr-1" /> Failing
    </Badge>
  );

const StatTile = ({ label, value, tone }: { label: string; value: number | string; tone?: "ok" | "warn" | "bad" }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div
      className={
        "mt-1 text-2xl font-semibold " +
        (tone === "ok"
          ? "text-emerald-600 dark:text-emerald-400"
          : tone === "bad"
            ? "text-destructive"
            : tone === "warn"
              ? "text-amber-600 dark:text-amber-400"
              : "text-foreground")
      }
    >
      {value}
    </div>
  </div>
);

const AdminSeoStatus = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<AuditResult | null>(null);

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ["seo-audit-recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(
          "id,slug,title,description,category,image_url,prep_time_minutes,cook_time_minutes,servings,ingredients,instructions,seo_title,seo_description",
        );
      if (error) throw error;
      return data as unknown as AuditableRecipe[];
    },
  });

  const audited = useMemo(() => (recipes ?? []).map(auditRecipe), [recipes]);
  const dupes = useMemo(() => findDuplicates(audited), [audited]);

  const stats = useMemo(() => {
    const total = audited.length;
    const passing = audited.filter((r) => r.ok).length;
    const failing = total - passing;
    const avgTitle = total ? Math.round(audited.reduce((s, r) => s + r.seoTitleLen, 0) / total) : 0;
    const avgDesc = total ? Math.round(audited.reduce((s, r) => s + r.seoDescLen, 0) / total) : 0;
    return { total, passing, failing, avgTitle, avgDesc, dupTitles: dupes.dupTitles.size, dupDescs: dupes.dupDescs.size };
  }, [audited, dupes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = audited.filter((r) => {
      if (statusFilter === "passing" && !r.ok) return false;
      if (statusFilter === "failing" && r.ok) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (q && !r.title.toLowerCase().includes(q) && !r.slug.toLowerCase().includes(q)) return false;
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    out = [...out].sort((a, b) => {
      switch (sortKey) {
        case "title":
          return a.title.localeCompare(b.title) * dir;
        case "category":
          return a.category.localeCompare(b.category) * dir;
        case "status":
          return ((a.ok ? 1 : 0) - (b.ok ? 1 : 0)) * dir;
        case "schema":
          return (a.schemaPresent.length - b.schemaPresent.length) * dir;
        case "title_len":
          return (a.seoTitleLen - b.seoTitleLen) * dir;
        case "desc_len":
          return (a.seoDescLen - b.seoDescLen) * dir;
      }
    });
    return out;
  }, [audited, search, statusFilter, categoryFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortBtn = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className="w-3 h-3 opacity-60" />
    </button>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl mb-2">Recipe SEO status</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Per-recipe audit of JSON-LD schema fields and meta tag lengths. Mirrors the data used by{" "}
            <code className="text-xs">scripts/seo-audit.mjs</code> and the live page output.
          </p>
        </header>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 text-destructive p-4 text-sm">
            Failed to load recipes: {(error as Error).message}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Summary tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
              <StatTile label="Total" value={stats.total} />
              <StatTile label="Passing" value={stats.passing} tone="ok" />
              <StatTile label="Failing" value={stats.failing} tone={stats.failing ? "bad" : "ok"} />
              <StatTile label="Dup. titles" value={stats.dupTitles} tone={stats.dupTitles ? "warn" : "ok"} />
              <StatTile label="Avg title len" value={`${stats.avgTitle}/${TITLE_LIMIT}`} />
              <StatTile label="Avg desc len" value={`${stats.avgDesc}/${DESC_LIMIT}`} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title or slug…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="passing">Passing only</SelectItem>
                  <SelectItem value="failing">Failing only</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {Object.entries(categoryLabels).map(([slug, label]) => (
                    <SelectItem key={slug} value={slug}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(search || statusFilter !== "all" || categoryFilter !== "all") && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              Showing {filtered.length} of {audited.length} recipes
            </p>

            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><SortBtn k="status">Status</SortBtn></TableHead>
                    <TableHead><SortBtn k="title">Recipe</SortBtn></TableHead>
                    <TableHead><SortBtn k="category">Category</SortBtn></TableHead>
                    <TableHead><SortBtn k="schema">Schema</SortBtn></TableHead>
                    <TableHead><SortBtn k="title_len">Title</SortBtn></TableHead>
                    <TableHead><SortBtn k="desc_len">Desc</SortBtn></TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const dupTitle = dupes.dupTitles.has(r.slug);
                    const dupDesc = dupes.dupDescs.has(r.slug);
                    return (
                      <TableRow
                        key={r.id}
                        className="cursor-pointer hover:bg-muted/40"
                        onClick={() => setSelected(r)}
                      >
                        <TableCell><StatusPill ok={r.ok} /></TableCell>
                        <TableCell>
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs text-muted-foreground">/recipes/{r.slug}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {categoryLabels[r.category as keyof typeof categoryLabels] ?? r.category}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              r.schemaPresent.length === 9
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-destructive"
                            }
                          >
                            {r.schemaPresent.length}/9
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={r.seoTitleLen > TITLE_LIMIT ? "text-destructive" : ""}>
                            {r.seoTitleLen}
                          </span>
                          {dupTitle && (
                            <Badge variant="outline" className="ml-2 text-amber-600 border-amber-500/40">dup</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={r.seoDescLen > DESC_LIMIT ? "text-destructive" : ""}>
                            {r.seoDescLen}
                          </span>
                          {dupDesc && (
                            <Badge variant="outline" className="ml-2 text-amber-600 border-amber-500/40">dup</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/recipes/${r.slug}/edit`}>Edit</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                        No recipes match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {/* Detail dialog */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <StatusPill ok={selected.ok} />
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs">
                    {selected.url}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                  <section>
                    <h3 className="text-sm font-semibold mb-2">JSON-LD schema fields</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {REQUIRED_SCHEMA_FIELDS.map((f) => {
                        const present = selected.schemaPresent.includes(f);
                        return (
                          <div
                            key={f}
                            className={
                              "flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs " +
                              (present
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : "border-destructive/40 bg-destructive/10 text-destructive")
                            }
                          >
                            {present ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <code>{f}</code>
                          </div>
                        );
                      })}
                    </div>
                    {selected.schemaMissing.length > 0 && (
                      <p className="text-xs text-destructive mt-2">
                        Missing: {selected.schemaMissing.join(", ")}
                      </p>
                    )}
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold mb-2">Meta tags</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Title ({selected.seoTitleLen}/{TITLE_LIMIT})
                        </div>
                        <div className="font-mono text-xs bg-muted/40 rounded px-2 py-1 mt-1 break-words">
                          {selected.seoTitle || <em className="text-destructive">empty</em>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Description ({selected.seoDescLen}/{DESC_LIMIT})
                        </div>
                        <div className="font-mono text-xs bg-muted/40 rounded px-2 py-1 mt-1 break-words">
                          {selected.seoDesc || <em className="text-destructive">empty</em>}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Prep</div>
                      <div>{selected.prepMinutes} min</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Cook</div>
                      <div>{selected.cookMinutes} min</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Ingredients</div>
                      <div>{selected.ingredientCount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Steps</div>
                      <div>{selected.instructionCount}</div>
                    </div>
                  </section>

                  {selected.issues.length > 0 && (
                    <section>
                      <h3 className="text-sm font-semibold mb-2 text-destructive">Issues</h3>
                      <ul className="text-xs list-disc pl-5 space-y-1 text-destructive">
                        {selected.issues.map((i) => <li key={i}>{i}</li>)}
                      </ul>
                    </section>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button asChild>
                      <Link to={`/admin/recipes/${selected.slug}/edit`}>Edit recipe</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={selected.url} target="_blank" rel="noreferrer">
                        View page <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(
                          `https://stirandsimmer.co.uk${selected.url}`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Rich Results Test <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminSeoStatus;
