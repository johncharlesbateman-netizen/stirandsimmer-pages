import { MEAL_TYPES, mealTypeLabels, type MealType } from "@/lib/meal-types";

interface Props {
  value: MealType[];
  onChange: (next: MealType[]) => void;
}

const MealTypePicker = ({ value, onChange }: Props) => {
  const toggle = (t: MealType) => {
    if (value.includes(t)) {
      onChange(value.filter((x) => x !== t));
    } else {
      onChange([...value, t]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {MEAL_TYPES.map((t) => {
        const active = value.includes(t);
        return (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-secondary"
            }`}
          >
            {mealTypeLabels[t]}
          </button>
        );
      })}
    </div>
  );
};

export default MealTypePicker;
