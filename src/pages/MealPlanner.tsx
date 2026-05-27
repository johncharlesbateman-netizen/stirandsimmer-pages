import { useState, useMemo, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Printer, Trash2, X, Plus, Check, BookOpen, Pencil, ShoppingBasket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { mergeIngredients } from "@/lib/ingredientMerger";
import { isSectionHeader } from "@/lib/ingredient-utils";
import { cn } from "@/lib/utils";
import { RECIPE_TILES } from "@/lib/recipe-tiles";
import { optimisedImage } from "@/lib/image-utils";
import type { Tables } from "@/integrations/supabase/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ── Types ────────────────────────────────────────────────── */

type Recipe = Tables<"recipes"> & { ingredients: string[] };

interface AssignedRecipe {
  id: string;
  title: string;
  slug: string;
  ingredients: string[];
}

type MealType = "lunch" | "dinner";
type WeekPlan = Record<string, Record<MealType, AssignedRecipe | null>>;

/* ── Constants ────────────────────────────────────────────── */

const DAYS = [
  { full: "Monday", abbr: "Mon" },
  { full: "Tuesday", abbr: "Tue" },
  { full: "Wednesday", abbr: "Wed" },
  { full: "Thursday", abbr: "Thu" },
  { full: "Friday", abbr: "Fri" },
  { full: "Saturday", abbr: "Sat" },
  { full: "Sunday", abbr: "Sun" },
];
const MEALS: { key: MealType; label: string }[] = [
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
];

const STORAGE_KEY = "gfr-meal-plan";
const SELECTIONS_KEY = "gfr-ingredient-selections";
const SHOPPING_CHECKED_KEY = "gfr-shopping-checked";
const NOTES_KEY = "gfr-meal-notes";

const emptyWeek = (): WeekPlan =>
  Object.fromEntries(DAYS.map((d) => [d.full, { lunch: null, dinner: null }])) as WeekPlan;

const loadSavedPlan = (): WeekPlan => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as WeekPlan;
      if (parsed && typeof parsed === "object" && DAYS.every((d) => d.full in parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return emptyWeek();
};

/* Get current Monday-based week dates */
const getWeekDates = (): Date[] => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sun
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

/* ── Component ────────────────────────────────────────────── */

const MealPlanner = () => {
  const [plan, setPlan] = useState<WeekPlan>(loadSavedPlan);
  const [activeSlot, setActiveSlot] = useState<{ day: string; meal: MealType } | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [editingIngredients, setEditingIngredients] = useState<{
    items: string[];
    checked: Set<number>;
    newIng: string;
  } | null>(null);
  const [shoppingChecked, setShoppingChecked] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(SHOPPING_CHECKED_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [savedFlash, setSavedFlash] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const [selections, setSelections] = useState<Record<string, number[]>>(() => {
    try {
      const saved = localStorage.getItem(SELECTIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  /* Free-text notes per slot — visitors can type their own meal ideas */
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const weekDates = useMemo(getWeekDates, []);
  const computeTodayIdx = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return weekDates.findIndex((d) => d.getTime() === today.getTime());
  }, [weekDates]);
  const [todayIdx, setTodayIdx] = useState<number>(() => computeTodayIdx());

  // Recompute todayIdx at the next local midnight, and again whenever the tab
  // becomes visible (covers cases where the timeout was throttled while hidden).
  useEffect(() => {
    let timeoutId: number | undefined;
    const scheduleMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 5, 0); // 5s past midnight to avoid races
      const ms = next.getTime() - now.getTime();
      timeoutId = window.setTimeout(() => {
        setTodayIdx(computeTodayIdx());
        scheduleMidnight();
      }, ms);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") setTodayIdx(computeTodayIdx());
    };
    scheduleMidnight();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [computeTodayIdx]);

  /* Persist — debounced to avoid writing on every keystroke */
  const useDebouncedLocalStorage = (key: string, value: unknown, delay = 500) => {
    useEffect(() => {
      const id = window.setTimeout(() => {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
      }, delay);
      return () => window.clearTimeout(id);
    }, [key, value, delay]);
  };
  useDebouncedLocalStorage(STORAGE_KEY, plan);
  useDebouncedLocalStorage(SELECTIONS_KEY, selections);
  useDebouncedLocalStorage(NOTES_KEY, notes);
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(SHOPPING_CHECKED_KEY, JSON.stringify(Array.from(shoppingChecked)));
      } catch { /* quota */ }
    }, 500);
    return () => window.clearTimeout(id);
  }, [shoppingChecked]);

  /* Recipes — only the columns needed for the picker */
  const { data: allRecipes = [] } = useQuery({
    queryKey: ["all-recipes", "planner"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, slug, description, image_url, prep_time_minutes, cook_time_minutes, servings, ingredients, categories, cuisine_region")
        .eq("published", true)
        .order("title");
      if (error) throw error;
      return (data ?? []) as unknown as Recipe[];
    },
  });

  /* Filter chips mirror the Recipes tile categories exactly. */
  const filterTiles = useMemo(
    () =>
      RECIPE_TILES.filter((t) =>
        t.slug === "all" ? true : allRecipes.some((r) => t.filter(r)),
      ),
    [allRecipes],
  );

  const activeTile =
    filterTiles.find((t) => t.slug === activeFilter) ?? filterTiles[0];

  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRecipes.filter((r) => {
      if (activeTile && !activeTile.filter(r)) return false;
      if (q && !r.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allRecipes, search, activeTile]);

  /* Slot operations */
  const openSlot = (day: string, meal: MealType) => {
    setActiveSlot({ day, meal });
    setEditingIngredients(null);
    // scroll to find-a-recipe panel on small screens
    setTimeout(() => {
      document.getElementById("find-recipe-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  };

  const assignToActiveSlot = (recipe: Recipe) => {
    if (!activeSlot) return;
    const ings = (recipe.ingredients as string[]) || [];
    const assigned: AssignedRecipe = {
      id: recipe.id,
      title: recipe.title,
      slug: recipe.slug,
      ingredients: ings,
    };
    setPlan((prev) => ({
      ...prev,
      [activeSlot.day]: { ...prev[activeSlot.day], [activeSlot.meal]: assigned },
    }));
    const slotKey = `${activeSlot.day}::${activeSlot.meal}`;
    setSelections((prev) => ({ ...prev, [slotKey]: ings.map((_, i) => i) }));
    setEditingIngredients({
      items: ings,
      checked: new Set(ings.map((_, i) => i)),
      newIng: "",
    });
  };

  const removeSlot = (day: string, meal: MealType) => {
    setPlan((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: null } }));
    const key = `${day}::${meal}`;
    setSelections((prev) => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  /* Ingredient editor */
  const toggleIngCheck = (i: number) => {
    if (!editingIngredients) return;
    const next = new Set(editingIngredients.checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setEditingIngredients({ ...editingIngredients, checked: next });
  };

  const editIngText = (i: number, val: string) => {
    if (!editingIngredients) return;
    const items = [...editingIngredients.items];
    items[i] = val;
    setEditingIngredients({ ...editingIngredients, items });
  };

  const deleteIng = (i: number) => {
    if (!editingIngredients) return;
    const items = editingIngredients.items.filter((_, idx) => idx !== i);
    const checked = new Set<number>();
    editingIngredients.checked.forEach((idx) => {
      if (idx < i) checked.add(idx);
      else if (idx > i) checked.add(idx - 1);
    });
    setEditingIngredients({ ...editingIngredients, items, checked });
  };

  const addIng = () => {
    if (!editingIngredients || !editingIngredients.newIng.trim()) return;
    const items = [...editingIngredients.items, editingIngredients.newIng.trim()];
    const checked = new Set(editingIngredients.checked);
    checked.add(items.length - 1);
    setEditingIngredients({ items, checked, newIng: "" });
  };

  const saveEditedIngredients = () => {
    if (!editingIngredients || !activeSlot) return;
    const slotKey = `${activeSlot.day}::${activeSlot.meal}`;
    // Update assigned recipe ingredients
    setPlan((prev) => {
      const slot = prev[activeSlot.day][activeSlot.meal];
      if (!slot) return prev;
      return {
        ...prev,
        [activeSlot.day]: {
          ...prev[activeSlot.day],
          [activeSlot.meal]: { ...slot, ingredients: editingIngredients.items },
        },
      };
    });
    setSelections((prev) => ({
      ...prev,
      [slotKey]: Array.from(editingIngredients.checked),
    }));
    setEditingIngredients(null);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  /* Shopping list */
  const mergedShoppingList = useMemo(() => {
    const lists: string[][] = [];
    for (const day of DAYS) {
      for (const { key } of MEALS) {
        const r = plan[day.full][key];
        if (!r) continue;
        const slotKey = `${day.full}::${key}`;
        const checked = selections[slotKey];
        const filterHeaders = (items: string[]) => items.filter((t) => !isSectionHeader(t));
        if (checked && checked.length > 0) {
          const set = new Set(checked);
          lists.push(filterHeaders(r.ingredients.filter((_, i) => set.has(i))));
        } else if (checked === undefined) {
          lists.push(filterHeaders(r.ingredients));
        }
      }
    }
    if (lists.length === 0) return [];
    try {
      return mergeIngredients(lists);
    } catch {
      return lists.flat();
    }
  }, [plan, selections]);

  const toggleShoppingItem = (item: string) => {
    setShoppingChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const clearAll = () => {
    setPlan(emptyWeek());
    setSelections({});
    setNotes({});
    setShoppingChecked(new Set());
    setActiveSlot(null);
    setEditingIngredients(null);
  };

  const clearShoppingList = () => {
    setShoppingChecked(new Set());
  };

  const printWeek = () => window.print();

  const printShoppingList = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const escapeHtml = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    const itemsHtml = mergedShoppingList
      .map((i) => `<li>${escapeHtml(String(i))}</li>`)
      .join("");
    w.document.open();
    w.document.write(`<!DOCTYPE html><html><head><title>Shopping List</title>
      <style>body{font-family:system-ui;padding:2rem;max-width:600px;margin:auto}
      h1{font-size:1.4rem;margin-bottom:1rem}
      li{padding:.4rem 0;border-bottom:1px solid hsl(36 15% 85%);list-style:none}
      li::before{content:"☐ ";color:hsl(36 15% 60%)}</style></head><body>
      <h1>Shopping List — Stir & Simmer</h1><ul>${itemsHtml}</ul></body></html>`);
    w.document.close();
    w.print();
  };

  const activeSlotKey = activeSlot ? `${activeSlot.day}::${activeSlot.meal}` : null;

  return (
    <Layout>
      <Helmet>
        <title>Weekly Meal Planner | Stir & Simmer</title>
        <meta name="description" content="Plan your week's meals, edit ingredients to match what's in your kitchen, and build a smart shopping list automatically. Free meal planner from Stir & Simmer." />
        <link rel="canonical" href="https://stirandsimmer.co.uk/meal-planner" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/meal-planner" />
        <meta property="og:title" content="Weekly Meal Planner | Stir & Simmer" />
        <meta property="og:description" content="Plan your week's meals, edit ingredients to match what's in your kitchen, and build a smart shopping list automatically. Free meal planner from Stir & Simmer." />
        <meta property="og:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Weekly Meal Planner | Stir & Simmer" />
        <meta name="twitter:description" content="Plan your week's meals, edit ingredients to match what's in your kitchen, and build a smart shopping list automatically. Free meal planner from Stir & Simmer." />
        <meta name="twitter:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <meta name="robots" content="noindex, nofollow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Weekly Meal Planner",
          url: "https://stirandsimmer.co.uk/meal-planner",
          description: "Plan your week's meals, edit ingredients to match what's in your kitchen, and build a smart shopping list automatically.",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires a modern web browser with JavaScript enabled.",
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "GBP",
          },
          publisher: {
            "@type": "Organization",
            name: "Stir & Simmer",
            url: "https://stirandsimmer.co.uk",
          },
        })}</script>
      </Helmet>

      <PageHero
        title="Plan your week"
        subtitle="Click to add, tweak and cook. Your week sorted in minutes."
        imageId="776538"
        imageAlt="A weekly meal planner notebook with fresh ingredients on a kitchen counter"
      />

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="rounded-2xl p-6 md:p-10 mb-8 flex flex-wrap items-center justify-between gap-4 bg-warm-dark">
          <div>
            <p className="text-sm md:text-base max-w-md font-light leading-relaxed text-warm-cream-muted">
              Search our recipes, tweak the ingredients to suit what you have, then build your shopping list automatically.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={printWeek}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-warm-amber text-warm-dark"
            >
              <Printer className="w-4 h-4" /> Print my week
            </button>
            <button
              onClick={() => setClearConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-warm-cream/40 text-warm-cream"
            >
              <Trash2 className="w-4 h-4" /> Clear all
            </button>
            {savedFlash && (
              <span
                role="status"
                className="self-center text-sm inline-flex items-center gap-1 text-warm-cream-muted"
              >
                <Check className="w-4 h-4" aria-hidden="true" /> Saved
              </span>
            )}
          </div>
        </section>

        {/* How it works — three steps so first-time visitors understand the flow */}
        <section
          aria-label="How the meal planner works"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
        >
          {[
            {
              n: 1,
              icon: BookOpen,
              title: "Add recipes to days",
              body: "Tap “+ Add recipe & ingredients” on any slot, or type your own meal idea straight into the slot.",
            },
            {
              n: 2,
              icon: Pencil,
              title: "Tweak ingredients",
              body: "Adjust quantities or remove items you already have, then save them to your shopping list.",
            },
            {
              n: 3,
              icon: ShoppingBasket,
              title: "Shop & cook",
              body: "Your weekly shopping list builds itself. Print it, tick items off, and you're set.",
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.n}
                className="bg-card border border-border rounded-xl p-4 flex gap-3 items-start"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-planner-soft text-planner flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
                    Step {step.n}
                  </div>
                  <div className="text-sm font-medium leading-snug mb-1">{step.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Week heading */}
        <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
          <p className="micro-caption">This week</p>
          <p className="text-[11px] text-muted-foreground/80 italic">
            Tip: typed meal ideas stay as personal notes — only ingredients from saved recipes are added to your shopping list.
          </p>
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-10">
          {DAYS.map((day, idx) => {
            const isToday = idx === todayIdx;
            const date = weekDates[idx];
            return (
              <div
                key={day.full}
                className={cn(
                  "bg-card border rounded-xl overflow-hidden transition-shadow hover:shadow-md",
                  isToday ? "border-planner ring-2 ring-planner-soft" : "border-border"
                )}
              >
                <div className={cn(
                  "px-2 py-2 text-center border-b",
                  isToday ? "bg-planner-soft border-planner/30" : "bg-secondary border-border"
                )}>
                  <div className={cn(
                    "text-[10px] font-medium uppercase tracking-wider",
                    isToday ? "text-planner" : "text-muted-foreground"
                  )}>
                    {isToday && <span className="sr-only">Today, </span>}
                    {day.abbr}
                  </div>
                  <div className={cn("text-lg font-medium leading-tight", isToday && "text-planner")}>
                    {date.getDate()}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-light">
                    {date.toLocaleString("en-GB", { month: "short" })}
                  </div>
                </div>

                {MEALS.map(({ key, label }) => {
                  const slot = plan[day.full][key];
                  const isActive = activeSlot?.day === day.full && activeSlot?.meal === key;
                  const noteKey = `${day.full}::${key}`;
                  const noteValue = notes[noteKey] ?? "";
                  return (
                    <div key={key} className="px-2 py-2 border-b border-border/40 last:border-b-0">
                      <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-1">
                        {label}
                      </div>
                      {slot ? (
                        <div className="space-y-1">
                          <button
                            onClick={() => openSlot(day.full, key)}
                            className={cn(
                              "block w-full text-left text-[11px] leading-snug font-medium hover:text-planner transition-colors line-clamp-3",
                              isActive && "text-planner"
                            )}
                          >
                            {slot.title}
                          </button>
                          <button
                            onClick={() => removeSlot(day.full, key)}
                            className="text-[10px] text-muted-foreground/50 hover:text-destructive transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <textarea
                            value={noteValue}
                            onChange={(e) =>
                              setNotes((prev) => ({ ...prev, [noteKey]: e.target.value }))
                            }
                            placeholder="Type a meal idea…"
                            rows={2}
                            className="w-full text-[11px] leading-snug bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 focus:bg-secondary/40 rounded p-1 -m-1 transition-colors"
                          />
                          <button
                            onClick={() => openSlot(day.full, key)}
                            className={cn(
                              "block w-full text-left text-[10px] border border-dashed rounded-md px-2 py-1 transition-colors",
                              isActive
                                ? "border-planner text-planner bg-planner-soft"
                                : "border-border text-muted-foreground hover:border-planner hover:text-planner hover:bg-planner-soft"
                            )}
                          >
                            + Add recipe & ingredients
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Recipe finder + ingredient editor */}
          <div id="find-recipe-panel" className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium" style={{ fontFamily: "'Boska', serif" }}>
                Find a recipe
              </h3>
              <span className="text-xs text-muted-foreground">
                {activeSlot ? `${activeSlot.day} · ${activeSlot.meal}` : "Select a slot to add"}
              </span>
            </div>

            <div className="p-5">
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search recipes…"
                  className="w-full border border-input bg-background rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none focus:border-planner transition-colors"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>

              {/* Filter chips */}
              {filterTiles.length > 1 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {filterTiles.map((tile) => (
                    <button
                      key={tile.slug}
                      onClick={() => setActiveFilter(tile.slug)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs border transition-colors",
                        activeFilter === tile.slug
                          ? "bg-foreground text-background border-foreground"
                          : "bg-card border-border hover:border-foreground hover:text-foreground",
                      )}
                    >
                      {tile.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Recipe list */}
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                {filteredRecipes.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-6">
                    No recipes found.
                  </p>
                ) : (
                  filteredRecipes.slice(0, 50).map((recipe) => (
                    <div
                      key={recipe.id}
                      className="border border-border rounded-lg p-2.5 flex items-center gap-3 hover:border-planner hover:bg-planner-soft transition-colors"
                    >
                      <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                        {recipe.image_url ? (
<img src={optimisedImage(recipe.image_url, { width: 80, height: 80 })} alt={recipe.title} loading="lazy" decoding="async" width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{recipe.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {recipe.servings ? `${recipe.servings} servings` : "—"}
                          {recipe.categories?.[0] ? ` · ${recipe.categories[0]}` : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => assignToActiveSlot(recipe)}
                        disabled={!activeSlot}
                        className="bg-planner text-planner-foreground rounded-md px-2.5 py-1.5 text-xs font-medium hover:bg-planner-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Ingredient editor */}
              {editingIngredients && activeSlot && (
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">Edit ingredients</h4>
                    <button
                      onClick={() => setEditingIngredients(null)}
                      className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Close
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Tick off what you already have, edit quantities, or add extras.
                  </p>

                  <div className="flex flex-col gap-1 mb-3">
                    {editingIngredients.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingIngredients.checked.has(i)}
                          onChange={() => toggleIngCheck(i)}
                          className="w-4 h-4 accent-planner cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => editIngText(i, e.target.value)}
                          className="flex-1 bg-transparent border-b border-border focus:border-planner text-sm py-1 outline-none transition-colors"
                        />
                        <button
                          onClick={() => deleteIng(i)}
                          className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
                          aria-label="Delete ingredient"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={editingIngredients.newIng}
                      onChange={(e) => setEditingIngredients({ ...editingIngredients, newIng: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && addIng()}
                      placeholder="Add an ingredient…"
                      className="flex-1 border border-input bg-background rounded-md px-3 py-2 text-sm outline-none focus:border-planner"
                    />
                    <button
                      onClick={addIng}
                      className="bg-secondary border border-border rounded-md px-3 py-2 text-sm hover:border-planner inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  <button
                    onClick={saveEditedIngredients}
                    className="w-full bg-planner text-planner-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-planner-accent transition-colors"
                  >
                    Save & add to shopping list
                  </button>
                </div>
              )}

              {/* Desserts box — quick picker for sweet recipes */}
              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-base font-medium" style={{ fontFamily: "'Boska', serif" }}>
                    Desserts
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    {activeSlot ? "Pick one to add" : "Select a slot first"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Browse all our dessert recipes and drop one straight into your week.
                </p>
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {allRecipes.filter((r) => (r.categories ?? []).includes("sweets")).length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-4">
                      No desserts found.
                    </p>
                  ) : (
                    allRecipes
                      .filter((r) => (r.categories ?? []).includes("sweets"))
                      .map((recipe) => (
                        <div
                          key={recipe.id}
                          className="border border-border rounded-lg p-2.5 flex items-center gap-3 hover:border-planner hover:bg-planner-soft transition-colors"
                        >
                          <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                            {recipe.image_url ? (
                              <img src={optimisedImage(recipe.image_url, { width: 80, height: 80 })} alt={recipe.title} loading="lazy" decoding="async" width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">🍰</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{recipe.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {recipe.servings ? `${recipe.servings} servings` : "—"}
                            </div>
                          </div>
                          <button
                            onClick={() => assignToActiveSlot(recipe)}
                            disabled={!activeSlot}
                            className="bg-planner text-planner-foreground rounded-md px-2.5 py-1.5 text-xs font-medium hover:bg-planner-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            Add
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shopping list */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium" style={{ fontFamily: "'Boska', serif" }}>
                Shopping list
              </h3>
              <span className="text-xs text-muted-foreground">
                {mergedShoppingList.length} item{mergedShoppingList.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="p-5">
              {mergedShoppingList.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-6">
                  Your shopping list will appear here as you add recipes.
                </p>
              ) : (
                <>
                  <ul className="space-y-1 mb-4 max-h-96 overflow-y-auto">
                    {mergedShoppingList.map((item, i) => {
                      const done = shoppingChecked.has(item);
                      return (
                        <li key={i} className="flex items-center gap-2 py-1.5 border-b border-border/40 last:border-b-0">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => toggleShoppingItem(item)}
                            className="w-4 h-4 accent-planner cursor-pointer flex-shrink-0"
                          />
                          <span className={cn("text-sm flex-1", done && "line-through text-muted-foreground")}>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={printShoppingList}
                      className="inline-flex items-center gap-1.5 bg-planner text-planner-foreground rounded-md px-3 py-2 text-sm font-medium hover:bg-planner-accent transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print list
                    </button>
                    <button
                      onClick={clearShoppingList}
                      className="inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-2 text-sm hover:border-destructive hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear ticks
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear the entire week's plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all recipes, notes and shopping list selections for the week. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAll}>Clear week</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default MealPlanner;
