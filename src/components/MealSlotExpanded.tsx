import { useState, useEffect, useRef } from "react";
import { Pencil, Replace, Trash2, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type SlotView = "default" | "actions" | "ingredients";

interface Props {
  recipeTitle: string;
  recipeSlug: string;
  ingredients: string[];
  checkedIndices: number[] | undefined;
  onSaveSelection: (indices: number[]) => void;
  onReplace: () => void;
  onRemove: () => void;
}

const MealSlotExpanded = ({
  recipeTitle,
  ingredients,
  checkedIndices,
  onSaveSelection,
  onReplace,
  onRemove,
}: Props) => {
  const [view, setView] = useState<SlotView>("default");
  const [localChecked, setLocalChecked] = useState<Set<number>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  // When opening ingredients, initialise checkboxes
  useEffect(() => {
    if (view === "ingredients") {
      const initial =
        checkedIndices !== undefined
          ? new Set(checkedIndices)
          : new Set(ingredients.map((_, i) => i));
      setLocalChecked(initial);
    }
  }, [view, checkedIndices, ingredients]);

  const toggle = (i: number) => {
    setLocalChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const checkedCount =
    checkedIndices !== undefined ? checkedIndices.length : ingredients.length;
  const hasCustomSelection = checkedIndices !== undefined && checkedIndices.length < ingredients.length;

  if (view === "default") {
    return (
      <div className="flex-1 flex flex-col">
        <button
          onClick={() => setView("actions")}
          className="text-xs font-medium text-foreground hover:text-muted-foreground transition-colors line-clamp-2 mb-auto text-left"
        >
          {recipeTitle}
        </button>
        {hasCustomSelection && (
          <span className="text-[10px] text-muted-foreground/40 mt-1">
            {checkedCount}/{ingredients.length} ingredients
          </span>
        )}
      </div>
    );
  }

  if (view === "actions") {
    return (
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-xs font-medium text-foreground line-clamp-1 mb-1">{recipeTitle}</p>
        <button
          onClick={() => setView("ingredients")}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          <Pencil className="w-3 h-3" />
          Edit Ingredients
        </button>
        <button
          onClick={() => { setView("default"); onReplace(); }}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          <Replace className="w-3 h-3" />
          Replace Recipe
        </button>
        <button
          onClick={() => { setView("default"); onRemove(); }}
          className="flex items-center gap-1.5 text-[11px] text-destructive/70 hover:text-destructive transition-colors py-1"
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </button>
        <button
          onClick={() => setView("default")}
          className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors mt-1 self-start"
        >
          Cancel
        </button>
      </div>
    );
  }

  // Ingredients view
  return (
    <div ref={contentRef} className="flex-1 flex flex-col">
      <p className="text-xs font-medium text-foreground line-clamp-1 mb-2">{recipeTitle}</p>
      <ul className="space-y-1.5 mb-3">
        {ingredients.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <Checkbox
              checked={localChecked.has(i)}
              onCheckedChange={() => toggle(i)}
              id={`slot-ing-${i}`}
              className="mt-0.5 h-3.5 w-3.5"
            />
            <label
              htmlFor={`slot-ing-${i}`}
              className={`text-[11px] leading-tight cursor-pointer transition-colors ${
                localChecked.has(i)
                  ? "text-foreground"
                  : "text-muted-foreground/40 line-through"
              }`}
            >
              {item}
            </label>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => {
            onSaveSelection(Array.from(localChecked));
            setView("default");
          }}
          className="flex items-center gap-1 text-[11px] font-medium bg-foreground text-background px-2.5 py-1.5 hover:bg-foreground/90 transition-colors"
        >
          <Check className="w-3 h-3" />
          Add to Shopping List
        </button>
        <button
          onClick={() => setView("default")}
          className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MealSlotExpanded;
