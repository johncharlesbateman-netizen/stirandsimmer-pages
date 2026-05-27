import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Upload, X, Plus, Loader2, ArrowUp, ArrowDown, CornerDownRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { allCategories } from "@/lib/recipe-utils";
import { collections, collectionNames } from "@/lib/collections";
import { CUISINE_REGIONS, sanitiseCuisineRegion, type CuisineRegion } from "@/lib/cuisine-regions";
import { MEAL_TYPES, sanitiseMealTypes, type MealType } from "@/lib/meal-types";
import CuisineRegionPicker from "@/components/CuisineRegionPicker";
import CategoryPicker from "@/components/CategoryPicker";
import MealTypePicker from "@/components/MealTypePicker";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type RecipeCategory = Database["public"]["Enums"]["recipe_category"];

const recipeSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title too long"),
  categories: z.array(z.enum([
    "chicken", "beef", "lamb", "pork", "spicy", "seafood",
    "lunch_suggestions", "sweets", "pasta",
  ])).min(1, "Pick at least one category"),
  description: z.string().trim().min(1, "Description is required").max(1000, "Description too long"),
  prep_time_minutes: z.number().int().min(0).max(9999).nullable(),
  cook_time_minutes: z.number().int().min(0).max(9999).nullable(),
  servings: z.number().int().min(1).max(999).nullable(),
  ingredients: z.array(z.string().trim().min(1)).min(1, "At least one ingredient required"),
  instructions: z.array(z.string().trim().min(1)).min(1, "At least one instruction required"),
  tips: z.string().trim().max(2000).nullable(),
  seo_title: z.string().trim().max(70).nullable(),
  seo_description: z.string().trim().max(170).nullable(),
  collections: z.array(z.string()).default([]),
  cuisine_region: z.enum(CUISINE_REGIONS).nullable(),
  meal_types: z.array(z.enum(MEAL_TYPES)).min(1, "Pick at least one meal type"),
});

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const AdminEditRecipe = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [tips, setTips] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [recipeCollections, setRecipeCollections] = useState<string[]>([]);
  const [cuisineRegion, setCuisineRegion] = useState<CuisineRegion | null>(null);
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const fetchRecipe = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error || !data) {
        toast({ title: "Recipe not found", variant: "destructive" });
        navigate("/recipes");
        return;
      }

      setTitle(data.title);
      setCategories(Array.isArray(data.categories) ? data.categories : []);
      setDescription(data.description);
      setPrepTime(data.prep_time_minutes?.toString() || "");
      setCookTime(data.cook_time_minutes?.toString() || "");
      setServings(data.servings?.toString() || "");
      setIngredients(Array.isArray(data.ingredients) && data.ingredients.length > 0 ? data.ingredients as string[] : [""]);
      setInstructions(Array.isArray(data.instructions) && data.instructions.length > 0 ? data.instructions as string[] : [""]);
      setTips(data.tips || "");
      setSeoTitle((data as { seo_title?: string | null }).seo_title || "");
      setSeoDescription((data as { seo_description?: string | null }).seo_description || "");
      setRecipeCollections(
        Array.isArray((data as { collections?: string[] | null }).collections)
          ? ((data as { collections?: string[] | null }).collections as string[])
          : [],
      );
      setCuisineRegion(sanitiseCuisineRegion(data.cuisine_region));
      const seededMeal = sanitiseMealTypes((data as { meal_types?: unknown }).meal_types);
      setMealTypes(seededMeal.length > 0 ? seededMeal : ["mains"]);
      setExistingImageUrl(data.image_url);
      setImagePreview(data.image_url);
      setPublished((data as { published?: boolean | null }).published ?? true);
      setLoading(false);
    };

    fetchRecipe();
  }, [slug, navigate]);

  const updateListItem = (
    list: string[],
    setter: (v: string[]) => void,
    idx: number,
    value: string
  ) => {
    const next = [...list];
    next[idx] = value;
    setter(next);
  };

  const addListItem = (list: string[], setter: (v: string[]) => void) =>
    setter([...list, ""]);

  const removeListItem = (
    list: string[],
    setter: (v: string[]) => void,
    idx: number
  ) => {
    if (list.length === 1) return;
    setter(list.filter((_, i) => i !== idx));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    setSubmitting(true);

    try {
      const cleaned = {
        title,
        categories,
        description,
        prep_time_minutes: prepTime ? parseInt(prepTime, 10) : null,
        cook_time_minutes: cookTime ? parseInt(cookTime, 10) : null,
        servings: servings ? parseInt(servings, 10) : null,
        ingredients: ingredients.map((s) => s.trim()).filter(Boolean),
        instructions: instructions.map((s) => s.trim()).filter(Boolean),
        tips: tips.trim() || null,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        collections: recipeCollections.filter((c) => collectionNames.includes(c)),
        cuisine_region: cuisineRegion,
        meal_types: mealTypes,
      };

      const parsed = recipeSchema.safeParse(cleaned);
      if (!parsed.success) {
        toast({
          title: "Validation error",
          description: parsed.error.issues[0]?.message ?? "Please check the form",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Upload new image if provided
      let image_url = existingImageUrl;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() || "jpg";
        const filename = `${Date.now()}-${slugify(title)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("recipe-images")
          .upload(filename, imageFile, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("recipe-images")
          .getPublicUrl(filename);
        image_url = urlData.publicUrl;
      }

      // Update recipe
      const { error: updateError } = await supabase.from("recipes").update({
        title: parsed.data.title,
        categories: parsed.data.categories,
        description: parsed.data.description,
        prep_time_minutes: parsed.data.prep_time_minutes,
        cook_time_minutes: parsed.data.cook_time_minutes,
        servings: parsed.data.servings,
        ingredients: parsed.data.ingredients,
        instructions: parsed.data.instructions,
        tips: parsed.data.tips,
        seo_title: parsed.data.seo_title,
        seo_description: parsed.data.seo_description,
        collections: parsed.data.collections,
        cuisine_region: parsed.data.cuisine_region,
        meal_types: parsed.data.meal_types,
        image_url,
        published,
      }).eq("slug", slug);

      if (updateError) throw updateError;

      toast({ title: "Recipe updated", description: title });
      navigate(`/recipes/${slug}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Failed to update recipe", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-20">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="mb-10">
          <p className="micro-caption mb-2">Admin</p>
          <h1 className="font-display text-4xl md:text-5xl">Edit Recipe</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            Update the recipe details. Fields marked * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Slow-roasted lamb shoulder"
              required
              maxLength={200}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">Categories *</label>
            <p className="text-xs text-muted-foreground mb-3">
              Pick one or more food categories. A recipe can belong to several (e.g. a chicken pasta).
            </p>
            <CategoryPicker value={categories} onChange={setCategories} />
          </div>

          {/* Cuisine region */}
          <div>
            <label className="block text-sm font-medium mb-2">Cuisine region</label>
            <p className="text-xs text-muted-foreground mb-3">
              Pick a single region. This maps to challenge regions in The Daily Pass app.
            </p>
            <CuisineRegionPicker value={cuisineRegion} onChange={setCuisineRegion} />
          </div>

          {/* Meal types */}
          <div>
            <label className="block text-sm font-medium mb-2">Meal types *</label>
            <p className="text-xs text-muted-foreground mb-3">
              Pick at least one meal type. Recipes can belong to more than one.
            </p>
            <MealTypePicker value={mealTypes} onChange={setMealTypes} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short, evocative summary..."
              required
              maxLength={1000}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-y"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Photo</label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" loading="lazy" decoding="async" width={256} height={192} className="w-64 h-48 object-cover rounded-md border border-border" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(existingImageUrl); }}
                  className="absolute top-2 right-2 p-1 bg-background border border-border rounded-md hover:bg-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-64 h-48 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-secondary transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Click to upload (max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium mb-2">Ingredients *</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={ing}
                    onChange={(e) => updateListItem(ingredients, setIngredients, i, e.target.value)}
                    placeholder="2 tbsp olive oil"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(ingredients, setIngredients, i)}
                    disabled={ingredients.length === 1}
                    className="px-3 border border-border rounded-md hover:bg-secondary disabled:opacity-30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addListItem(ingredients, setIngredients)}>
                <Plus className="w-4 h-4" /> Add ingredient
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium mb-2">Instructions *</label>
            <p className="text-xs text-muted-foreground mb-3">
              Use the arrows to reorder steps, or the inline + to insert a new step above the current one.
            </p>
            <div className="space-y-2">
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-2">
                  <span className="pt-2 text-sm text-muted-foreground w-6">{i + 1}.</span>
                  <textarea
                    value={step}
                    onChange={(e) => updateListItem(instructions, setInstructions, i, e.target.value)}
                    placeholder="Preheat the oven to 180°C..."
                    rows={2}
                    className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm resize-y"
                  />
                  <div className="flex flex-col gap-1 self-start">
                    <button
                      type="button"
                      title="Insert step above"
                      onClick={() => {
                        const next = [...instructions];
                        next.splice(i, 0, "");
                        setInstructions(next);
                      }}
                      className="px-2 py-1 border border-border rounded-md hover:bg-secondary"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        title="Move up"
                        onClick={() => {
                          if (i === 0) return;
                          const next = [...instructions];
                          [next[i - 1], next[i]] = [next[i], next[i - 1]];
                          setInstructions(next);
                        }}
                        disabled={i === 0}
                        className="px-2 py-1 border border-border rounded-md hover:bg-secondary disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Move down"
                        onClick={() => {
                          if (i === instructions.length - 1) return;
                          const next = [...instructions];
                          [next[i + 1], next[i]] = [next[i], next[i + 1]];
                          setInstructions(next);
                        }}
                        disabled={i === instructions.length - 1}
                        className="px-2 py-1 border border-border rounded-md hover:bg-secondary disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      title="Remove step"
                      onClick={() => removeListItem(instructions, setInstructions, i)}
                      disabled={instructions.length === 1}
                      className="px-2 py-1 border border-border rounded-md hover:bg-secondary disabled:opacity-30"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addListItem(instructions, setInstructions)}>
                <Plus className="w-4 h-4" /> Add step at end
              </Button>
            </div>
          </div>


          {/* Tips */}
          <div>
            <label className="block text-sm font-medium mb-2">Tips (optional)</label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Chef's notes, substitutions, serving suggestions..."
              maxLength={2000}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-y"
            />
          </div>

          {/* Collections */}
          <div className="space-y-3 pt-6 border-t border-border">
            <div>
              <h2 className="font-display text-2xl mb-1">Collections</h2>
              <p className="text-xs text-muted-foreground">
                Recipes were auto-assigned based on their attributes — tick or untick to override.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {collections.map((c) => {
                const checked = recipeCollections.includes(c.name);
                return (
                  <label
                    key={c.slug}
                    className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                      checked ? "border-foreground bg-secondary" : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setRecipeCollections((prev) =>
                          e.target.checked
                            ? [...prev, c.name]
                            : prev.filter((n) => n !== c.name),
                        );
                      }}
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div>
              <h2 className="font-display text-2xl mb-1">SEO settings</h2>
              <p className="text-xs text-muted-foreground">
                Optional. Leave blank to auto-generate from the recipe title and key ingredients.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Meta title{" "}
                <span className={`text-xs ${seoTitle.length > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                  ({seoTitle.length}/60)
                </span>
              </label>
              <Input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Slow-roasted lamb shoulder (4 hr) | Stir & Simmer"
                maxLength={70}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Meta description{" "}
                <span className={`text-xs ${seoDescription.length > 155 ? "text-destructive" : "text-muted-foreground"}`}>
                  ({seoDescription.length}/155)
                </span>
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Tender, fall-apart lamb shoulder with garlic, rosemary and red wine. Ready in 4 hours."
                maxLength={170}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-y"
              />
            </div>
          </div>

          {/* Publish toggle + Submit */}
          <div className="pt-4 border-t border-border space-y-4">
            <label className="flex items-start gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-secondary/50 transition-colors">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mt-1"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {published ? "Published" : "Draft (hidden from site)"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Published recipes appear in listings, counts and search. Untick to hide this recipe as a draft.
                </p>
              </div>
            </label>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Saving..." : (published ? "Save changes" : "Save as draft")}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(`/recipes/${slug}`)}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminEditRecipe;
