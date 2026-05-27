import { forwardRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { categoryLabels } from "@/lib/recipe-utils";
import { cn } from "@/lib/utils";
import { optimisedImage, responsiveSrcSet } from "@/lib/image-utils";
import { buildRecipeAltText } from "@/lib/seo";

const floatClasses = [
  "floating-item",
  "floating-item-delay-1",
  "floating-item-delay-2",
  "floating-item-delay-3",
  "floating-item-delay-4",
];

const layouts = [
  { colSpan: "md:col-span-7", aspect: "aspect-[4/3]", pt: "" },
  { colSpan: "md:col-span-5", aspect: "aspect-[3/4]", pt: "md:pt-24" },
  { colSpan: "md:col-span-4 md:col-start-2", aspect: "aspect-square", pt: "" },
  { colSpan: "md:col-span-6 md:col-start-7", aspect: "aspect-[4/3]", pt: "md:pt-16" },
  { colSpan: "md:col-span-10 md:col-start-2", aspect: "aspect-[16/9]", pt: "" },
];

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState<Tables<"recipes">[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setRecipes(data);
    };
    fetchRecipes();
  }, []);

  if (recipes.length === 0) return null;

  return (
    <section className="pb-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <p className="micro-caption mb-12">Featured Recipes</p>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {recipes.slice(0, 2).map((recipe, i) => (
            <div key={recipe.id} className={cn(layouts[i].colSpan, layouts[i].pt)}>
              <RecipeGalleryItem recipe={recipe} layout={layouts[i]} floatDelay={i} />
            </div>
          ))}

          {recipes.length > 2 && (
            <>
              <div className="md:col-span-12 py-12" />
              {recipes.slice(2, 4).map((recipe, i) => (
                <div key={recipe.id} className={cn(layouts[i + 2].colSpan, layouts[i + 2].pt)}>
                  <RecipeGalleryItem recipe={recipe} layout={layouts[i + 2]} floatDelay={i + 2} />
                </div>
              ))}
            </>
          )}

          {recipes.length > 4 && (
            <>
              <div className="md:col-span-12 py-8" />
              <div className={layouts[4].colSpan}>
                <RecipeGalleryItem recipe={recipes[4]} layout={layouts[4]} floatDelay={4} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

type RecipeGalleryItemProps = {
  recipe: Tables<"recipes">;
  layout: (typeof layouts)[number];
  floatDelay: number;
};

const RecipeGalleryItem = forwardRef<HTMLAnchorElement, RecipeGalleryItemProps>(({
  recipe,
  layout,
  floatDelay,
}, ref) => {
  const floatClass = floatClasses[floatDelay % floatClasses.length];

  return (
    <Link ref={ref} to={`/recipes/${recipe.slug}`} className={cn("group block", floatClass)}>
      <figure className="relative">
        <div className={cn("overflow-hidden bg-muted", layout.aspect)}>
          <img
            src={recipe.image_url ? optimisedImage(recipe.image_url, { width: 1200 }) : "/placeholder.svg"}
            srcSet={recipe.image_url ? responsiveSrcSet(recipe.image_url, [600, 900, 1200, 1600]) : undefined}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={buildRecipeAltText(recipe.title, (recipe.ingredients as string[] | null) ?? [])}
            loading={floatDelay === 0 ? "eager" : "lazy"}
            fetchPriority={floatDelay === 0 ? "high" : "auto"}
            decoding="async"
            width={1200}
            height={900}
            className="w-full h-full object-cover editorial-image"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
        </div>
        <figcaption className="mt-4 space-y-1">
          {recipe.categories?.[0] && <p className="micro-caption">{categoryLabels[recipe.categories[0]]}</p>}
          <h3 className="font-display text-xl md:text-2xl">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground italic font-display">
            {recipe.description}
          </p>
        </figcaption>
      </figure>
    </Link>
  );
});
RecipeGalleryItem.displayName = "RecipeGalleryItem";

export default FeaturedRecipes;
