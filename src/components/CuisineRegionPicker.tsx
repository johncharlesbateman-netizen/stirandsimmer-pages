import { CUISINE_REGIONS, cuisineRegionLabels, type CuisineRegion } from "@/lib/cuisine-regions";

interface Props {
  value: CuisineRegion | null;
  onChange: (next: CuisineRegion | null) => void;
}

const CuisineRegionPicker = ({ value, onChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {CUISINE_REGIONS.map((region) => {
        const active = value === region;
        return (
          <button
            key={region}
            type="button"
            onClick={() => onChange(active ? null : region)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-secondary"
            }`}
          >
            {cuisineRegionLabels[region]}
          </button>
        );
      })}
    </div>
  );
};

export default CuisineRegionPicker;
