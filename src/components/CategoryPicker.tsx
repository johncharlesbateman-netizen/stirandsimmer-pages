import { allCategories, categoryLabels } from "@/lib/recipe-utils";
import type { Database } from "@/integrations/supabase/types";

type RecipeCategory = Database["public"]["Enums"]["recipe_category"];

interface Props {
  value: RecipeCategory[];
  onChange: (next: RecipeCategory[]) => void;
}

const CategoryPicker = ({ value, onChange }: Props) => {
  const toggle = (cat: RecipeCategory) => {
    if (value.includes(cat)) onChange(value.filter((c) => c !== cat));
    else onChange([...value, cat]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((cat) => {
        const active = value.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => toggle(cat)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-secondary"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPicker;
