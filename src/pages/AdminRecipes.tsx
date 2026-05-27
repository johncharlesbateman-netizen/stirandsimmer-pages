import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Search, Pencil, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  updated_at: string;
  cuisine_region: string | null;
};

type Filter = "all" | "published" | "draft";

const AdminRecipes = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ["admin", "recipes-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, slug, title, published, updated_at, cuisine_region")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (filter === "published" && !r.published) return false;
      if (filter === "draft" && r.published) return false;
      if (q && !`${r.title} ${r.slug}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [recipes, query, filter]);

  const draftCount = recipes.filter((r) => !r.published).length;
  const publishedCount = recipes.length - draftCount;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="micro-caption mb-2">Admin</p>
            <h1 className="font-display text-4xl md:text-5xl">Recipes</h1>
            <p className="text-muted-foreground mt-3 text-sm">
              {recipes.length} total · {publishedCount} published · {draftCount} draft
              {draftCount === 1 ? "" : "s"}
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/recipes/new">
              <Plus className="w-4 h-4" /> New recipe
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or slug…"
              className="pl-9"
            />
          </div>
          <div className="flex border border-border rounded-md overflow-hidden">
            {(["all", "published", "draft"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-sm capitalize transition-colors ${
                  filter === f
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-16 text-center">
            No recipes match your filters.
          </p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-lg leading-tight">
                      {r.title}
                    </span>
                    {!r.published && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300">
                        Draft
                      </span>
                    )}
                    {r.cuisine_region && (
                      <span className="text-xs text-muted-foreground">
                        · {r.cuisine_region}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    /{r.slug} · updated{" "}
                    {new Date(r.updated_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.published && (
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/recipes/${r.slug}`}>
                        <ExternalLink className="w-4 h-4" /> View
                      </Link>
                    </Button>
                  )}
                  <Button asChild size="sm">
                    <Link to={`/admin/recipes/${r.slug}/edit`}>
                      <Pencil className="w-4 h-4" /> Edit
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default AdminRecipes;
