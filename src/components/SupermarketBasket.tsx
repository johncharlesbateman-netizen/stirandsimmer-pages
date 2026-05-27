import { useState, useMemo, useEffect } from "react";
import { ExternalLink, Info } from "lucide-react";
import {
  estimateAllPrices,
  type SupermarketId,
} from "@/lib/supermarketPricing";


const STORAGE_KEY = "preferred-supermarket";

interface SupermarketBasketProps {
  checkedItems: string[];
  scaleFactor?: number;
}

interface Supermarket {
  id: SupermarketId;
  name: string;
  colour: string;
  logo: string;
  buildSearchUrl: (term: string) => string;
}

/** Strip quantities/units to get a cleaner search term */
const toSearchTerm = (ingredient: string): string =>
  ingredient
    .replace(/^\d[\d./]*\s*/g, "")                       // leading numbers
    .replace(/\b(g|kg|ml|l|tbsp|tsp|cup|cups|oz|lb|bunch|handful|pinch|cloves?|slices?|rashers?|sheets?|sprigs?|stalks?|pieces?|small|medium|large|tin|tins|can|cans|pack|packs|packet|packets)\b/gi, "")
    .replace(/[,()\[\]]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const supermarkets: Supermarket[] = [
  {
    id: "aldi",
    name: "Aldi",
    colour: "hsl(213, 70%, 30%)",
    logo: "🔵",
    buildSearchUrl: (_term) =>
      `https://www.aldi.co.uk`,
  },
  {
    id: "lidl",
    name: "Lidl",
    colour: "hsl(50, 100%, 50%)",
    logo: "🟡",
    buildSearchUrl: (_term) =>
      `https://www.lidl.co.uk`,
  },
  {
    id: "asda",
    name: "ASDA",
    colour: "hsl(120, 61%, 38%)",
    logo: "🟢",
    buildSearchUrl: (term) =>
      `https://groceries.asda.com/search/${encodeURIComponent(term)}`,
  },
  {
    id: "tesco",
    name: "Tesco",
    colour: "hsl(0, 68%, 42%)",
    logo: "🔴",
    buildSearchUrl: (term) =>
      `https://www.tesco.com/groceries/en-GB/search?query=${encodeURIComponent(term)}`,
  },
  {
    id: "sainsburys",
    name: "Sainsbury's",
    colour: "hsl(24, 100%, 50%)",
    logo: "🟠",
    buildSearchUrl: (term) =>
      `https://www.sainsburys.co.uk/gol-ui/SearchResults/${encodeURIComponent(term)}`,
  },
  {
    id: "ocado",
    name: "Ocado",
    colour: "hsl(267, 56%, 48%)",
    logo: "🟣",
    buildSearchUrl: (term) =>
      `https://www.ocado.com/search?entry=${encodeURIComponent(term)}`,
  },
  {
    id: "waitrose",
    name: "Waitrose",
    colour: "hsl(145, 63%, 32%)",
    logo: "🟢",
    buildSearchUrl: (term) =>
      `https://www.waitrose.com/ecom/shop/search?&searchTerm=${encodeURIComponent(term)}`,
  },
  {
    id: "morrisons",
    name: "Morrisons",
    colour: "hsl(82, 70%, 40%)",
    logo: "🟡",
    buildSearchUrl: (_term) =>
      `https://groceries.morrisons.com`,
  },
  {
    id: "booths",
    name: "Booths",
    colour: "hsl(220, 60%, 35%)",
    logo: "🛒",
    buildSearchUrl: (term) =>
      `https://www.booths.co.uk/search?q=${encodeURIComponent(term)}`,
  },
];

const getStoredPreference = (): SupermarketId | null => {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val && supermarkets.some((s) => s.id === val)) return val as SupermarketId;
  } catch {}
  return null;
};

const SupermarketBasket = ({ checkedItems, scaleFactor = 1 }: SupermarketBasketProps) => {
  const [selected, setSelected] = useState<SupermarketId>(
    () => getStoredPreference() || "asda"
  );

  // Persist preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, selected);
    } catch {}
  }, [selected]);

  const prices = useMemo(() => {
    if (checkedItems.length === 0) return null;
    const base = estimateAllPrices(checkedItems);
    if (scaleFactor === 1) return base;
    // Scale all prices by the factor
    const scaled = {} as typeof base;
    for (const key of Object.keys(base) as SupermarketId[]) {
      const entry = base[key];
      const items = entry.items.map((item) => ({
        ...item,
        price: +(item.price * scaleFactor).toFixed(2),
      }));
      const total = +items.reduce((s, i) => s + i.price, 0).toFixed(2);
      scaled[key] = { ...entry, items, total };
    }
    return scaled;
  }, [checkedItems, scaleFactor]);

  if (checkedItems.length === 0 || !prices) return null;

  const activeMarket = supermarkets.find((s) => s.id === selected)!;
  const activePrices = prices[selected];

  // Sort supermarkets by total to highlight cheapest
  const sortedMarkets = [...supermarkets].sort(
    (a, b) => prices[a.id].total - prices[b.id].total
  );
  const cheapestId = sortedMarkets[0].id;

  /** Open a tab per ticked ingredient on the chosen supermarket */
  const openIngredientSearches = (market: Supermarket) => {
    // Limit to 5 tabs to avoid popup-blocker issues
    const terms = checkedItems.slice(0, 5).map(toSearchTerm).filter(Boolean);
    if (terms.length === 0) return;
    terms.forEach((term) => {
      window.open(market.buildSearchUrl(term), "_blank");
    });
  };

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center gap-2 mb-4">
        <p className="micro-caption">Price Estimates</p>
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            Estimated prices · actual prices may vary
          </div>
        </div>
      </div>

      {/* Supermarket cards — sorted cheapest first */}
      <div className="grid grid-cols-5 sm:grid-cols-4 gap-2 mb-2">
        {sortedMarkets.map((market) => {
          const isActive = market.id === selected;
          const total = prices[market.id].total;
          const isCheapest = market.id === cheapestId;

          return (
            <button
              key={market.id}
              onClick={() => {
                setSelected(market.id);
                openIngredientSearches(market);
              }}
              title={["lidl", "morrisons", "aldi"].includes(market.id) ? `Search for your ingredients on ${market.name}'s website` : undefined}
              className={`relative flex flex-col items-center gap-1 p-2 sm:p-3 border transition-all duration-200 text-center cursor-pointer group min-h-[44px] min-w-[44px] ${
                isActive
                  ? "border-foreground bg-secondary shadow-sm"
                  : "border-border hover:border-muted-foreground/40 hover:bg-secondary hover:shadow-sm"
              }`}
            >
              {isCheapest && (
                <span className="absolute -top-2 right-2 text-[10px] font-semibold tracking-wider uppercase bg-background border border-border px-1.5 py-0.5 text-muted-foreground">
                  Cheapest
                </span>
              )}
              <span
                aria-hidden="true"
                className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold group-hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: market.colour }}
              >
                {market.name.charAt(0)}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-foreground leading-tight">{market.name}</span>
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                ~£{total.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground/60 mb-4">
        Prices are estimates. Click a supermarket to check current prices.
      </p>

      {/* Per-ingredient price breakdown */}
      <ul className="space-y-1.5 mb-4">
        {activePrices.items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground truncate mr-2">
              {item.productName}
            </span>
            <span className="font-medium text-foreground whitespace-nowrap">
              ~£{item.price.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {/* Summary + CTA */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {checkedItems.length} item{checkedItems.length !== 1 ? "s" : ""}
          {" · "}
          <span className="font-medium text-foreground">
            ~£{activePrices.total.toFixed(2)}
          </span>
          <span className="text-xs ml-1">(est.)</span>
        </p>
        <button
          onClick={() => openIngredientSearches(activeMarket)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
        >
          Open {activeMarket.name}
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SupermarketBasket;
