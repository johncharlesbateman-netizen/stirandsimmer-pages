import { useState, useMemo } from "react";
import { ChevronDown, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { isSectionHeader } from "@/lib/ingredient-utils";
import type { ScaledIngredient, ScalingKind } from "@/lib/ingredient-scaler";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IngredientListProps {
  /** Either plain strings (legacy) or smart-scaled ingredients with metadata. */
  ingredients: (string | ScaledIngredient)[];
  checkedIngredients: Set<number>;
  onToggle: (index: number) => void;
}

interface NormalisedItem {
  text: string;
  kind: ScalingKind;
  note?: string;
}

interface Section {
  header: string | null;
  headerIndex: number | null;
  items: { item: NormalisedItem; originalIndex: number }[];
}

const kindLabel: Record<ScalingKind, string> = {
  linear: "",
  seasoning: "Seasoning",
  leavening: "Leavening agent",
  garnish: "Garnish",
};

const kindExplain: Record<ScalingKind, string> = {
  linear: "",
  seasoning:
    "Seasonings don't scale linearly — we've adjusted at a reduced rate. Taste and adjust as you cook.",
  leavening:
    "Leavening agents (baking powder, soda, yeast) can behave unpredictably when scaled. Double-check before baking.",
  garnish:
    "Garnishes are decorative — use as much or as little as you like.",
};

function normalise(item: string | ScaledIngredient): NormalisedItem {
  if (typeof item === "string") return { text: item, kind: "linear" };
  return { text: item.text, kind: item.kind, note: item.note };
}

const IngredientList = ({ ingredients, checkedIngredients, onToggle }: IngredientListProps) => {
  const sections = useMemo(() => {
    const result: Section[] = [];
    let current: Section = { header: null, headerIndex: null, items: [] };

    ingredients.forEach((raw, i) => {
      const item = normalise(raw);
      if (isSectionHeader(item.text)) {
        if (current.items.length > 0 || current.header) {
          result.push(current);
        }
        current = { header: item.text, headerIndex: i, items: [] };
      } else {
        current.items.push({ item, originalIndex: i });
      }
    });

    if (current.items.length > 0 || current.header) {
      result.push(current);
    }

    return result;
  }, [ingredients]);

  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const toggleSection = (sectionIndex: number) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(sectionIndex)) next.delete(sectionIndex);
      else next.add(sectionIndex);
      return next;
    });
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-1">
        {sections.map((section, sIdx) => {
          const isExpanded = !collapsed.has(sIdx);

          return (
            <div key={sIdx}>
              {section.header && (
                <button
                  onClick={() => toggleSection(sIdx)}
                  className="flex items-center justify-between w-full py-2 mt-3 first:mt-0 cursor-pointer group"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {section.header.replace(/:$/, "")}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      !isExpanded && "-rotate-90"
                    )}
                  />
                </button>
              )}

              {isExpanded && (
                <ul className="space-y-3 py-1">
                  {section.items.map(({ item, originalIndex }) => {
                    const checked = checkedIngredients.has(originalIndex);
                    const showBadge = item.kind !== "linear";
                    return (
                      <li key={originalIndex} className="flex items-start gap-3">
                        <Checkbox
                          id={`ingredient-${originalIndex}`}
                          checked={checked}
                          onCheckedChange={() => onToggle(originalIndex)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`ingredient-${originalIndex}`}
                            className={cn(
                              "text-sm cursor-pointer transition-colors",
                              checked
                                ? "line-through text-muted-foreground/40"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.text}
                          </label>
                          {showBadge && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className={cn(
                                    "ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-medium px-1.5 py-0.5 rounded-sm cursor-help align-middle",
                                    item.kind === "seasoning" && "bg-accent/10 text-accent",
                                    item.kind === "leavening" && "bg-wine/10 text-wine",
                                    item.kind === "garnish" && "bg-olive/10 text-olive",
                                  )}
                                  style={
                                    item.kind === "leavening"
                                      ? { backgroundColor: "hsl(var(--wine) / 0.1)", color: "hsl(var(--wine))" }
                                      : item.kind === "garnish"
                                        ? { backgroundColor: "hsl(var(--olive) / 0.12)", color: "hsl(var(--olive))" }
                                        : undefined
                                  }
                                >
                                  <Info className="w-2.5 h-2.5" />
                                  {item.note ?? kindLabel[item.kind]}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs text-xs">
                                <p className="font-semibold mb-1">{kindLabel[item.kind]}</p>
                                <p>{kindExplain[item.kind]}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default IngredientList;
