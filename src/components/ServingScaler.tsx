import { Minus, Plus } from "lucide-react";

interface ServingScalerProps {
  servings: number;
  baseServings: number;
  onChange: (servings: number) => void;
}

const ServingScaler = ({ servings, baseServings, onChange }: ServingScalerProps) => {
  const isOriginal = servings === baseServings;

  return (
    <div className="flex items-center justify-between py-3 mb-6 border-b border-border">
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">Serves</span>
        {!isOriginal && (
          <button
            onClick={() => onChange(baseServings)}
            className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors ml-1"
          >
            (reset)
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(1, servings - 1))}
          disabled={servings <= 1}
          className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-medium text-foreground w-6 text-center tabular-nums">
          {servings}
        </span>
        <button
          onClick={() => onChange(Math.min(24, servings + 1))}
          disabled={servings >= 24}
          className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ServingScaler;
