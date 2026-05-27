import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Check, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SupermarketBasket from "@/components/SupermarketBasket";
import { estimateAllPrices, type SupermarketId } from "@/lib/supermarketPricing";

interface ShoppingListProps {
  ingredients: string[];
  scaleFactor?: number;
  recipeName?: string;
}

const SUPERMARKET_LABELS: Record<SupermarketId, string> = {
  aldi: "Aldi",
  lidl: "Lidl",
  asda: "ASDA",
  morrisons: "Morrisons",
  booths: "Booths",
  tesco: "Tesco",
  sainsburys: "Sainsbury's",
  ocado: "Ocado",
  waitrose: "Waitrose",
};

const ShoppingList = ({ ingredients, scaleFactor = 1, recipeName = "Recipe" }: ShoppingListProps) => {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleCopy = async () => {
    const checkedItems = ingredients.filter((_, i) => checked.has(i));
    const text = checkedItems.length > 0 ? checkedItems.join("\n") : ingredients.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Copied!", description: checkedItems.length > 0 ? "Checked items copied to clipboard." : "All items copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Couldn't copy", variant: "destructive" });
    }
  };

  const handlePrint = () => {
    const checkedItems = ingredients.filter((_, i) => checked.has(i));
    const items = checkedItems.length > 0 ? checkedItems : ingredients;

    // Build price estimates
    const prices = estimateAllPrices(items);
    const scaledPrices = scaleFactor === 1
      ? prices
      : Object.fromEntries(
          (Object.keys(prices) as SupermarketId[]).map((key) => {
            const entry = prices[key];
            const scaledItems = entry.items.map((item) => ({
              ...item,
              price: +(item.price * scaleFactor).toFixed(2),
            }));
            const total = +scaledItems.reduce((s, i) => s + i.price, 0).toFixed(2);
            return [key, { ...entry, items: scaledItems, total }];
          })
        ) as typeof prices;

    // Sort supermarkets by total
    const sortedMarkets = (Object.keys(scaledPrices) as SupermarketId[]).sort(
      (a, b) => scaledPrices[a].total - scaledPrices[b].total
    );

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const esc = (s: unknown) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Shopping List — ${esc(recipeName)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'DM Sans', system-ui, sans-serif;
          padding: 2.5rem;
          color: #2b2b2b;
          max-width: 700px;
          margin: 0 auto;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
        }
        .recipe-name {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e8e4df;
        }
        .section-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          padding: 0.4rem 0;
          border-bottom: 1px solid #f0ece7;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        li::before {
          content: "☐";
          color: #aaa;
        }
        .prices-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-top: 0.75rem;
        }
        .price-card {
          border: 1px solid #e8e4df;
          padding: 0.6rem 0.5rem;
          text-align: center;
        }
        .price-card.cheapest {
          border-color: #2b2b2b;
          background: #faf9f7;
        }
        .price-card .name {
          font-size: 0.8rem;
          font-weight: 600;
        }
        .price-card .total {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.15rem;
        }
        .price-card .badge {
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          color: #888;
          margin-bottom: 0.15rem;
        }
        .breakdown {
          margin-top: 1rem;
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          padding: 0.25rem 0;
          border-bottom: 1px solid #f0ece7;
        }
        .breakdown-row .label { color: #666; }
        .breakdown-row .value { font-weight: 500; }
        .disclaimer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 2px solid #e8e4df;
          font-size: 0.75rem;
          color: #999;
          font-style: italic;
        }
        @media print {
          body { padding: 1.5rem; }
        }
      </style></head><body>
      <div class="logo">Stir & Simmer</div>
      <div class="recipe-name">${esc(recipeName)}</div>

      <div class="section-title">Shopping List · ${items.length} item${items.length !== 1 ? "s" : ""}</div>
      <ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>

      <div class="section-title">Estimated Prices</div>
      <div class="prices-grid">
        ${sortedMarkets
          .map((id, i) => {
            const label = SUPERMARKET_LABELS[id] || id;
            const total = scaledPrices[id].total;
            return `<div class="price-card${i === 0 ? " cheapest" : ""}">
              ${i === 0 ? '<div class="badge">Cheapest</div>' : ""}
              <div class="name">${esc(label)}</div>
              <div class="total">~£${total.toFixed(2)}</div>
            </div>`;
          })
          .join("")}
      </div>

      <div class="breakdown">
        ${scaledPrices[sortedMarkets[0]].items
          .map(
            (item) =>
              `<div class="breakdown-row"><span class="label">${esc(item.productName)}</span><span class="value">~£${item.price.toFixed(2)}</span></div>`
          )
          .join("")}
      </div>

      <div class="disclaimer">Prices are estimates — visit supermarket website for current prices.</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="mt-8 p-5 bg-secondary border border-border">
      <p className="micro-caption mb-4">Shopping List</p>
      <div className="flex items-center justify-center gap-4 mb-5 py-3 border-y border-border">
        <button
          onClick={() => {
            if (checked.size === ingredients.length) {
              setChecked(new Set());
            } else {
              setChecked(new Set(ingredients.map((_, i) => i)));
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {checked.size === ingredients.length ? "Clear all" : "Select all"}
        </button>
        <span className="text-border">|</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy checked"}
        </button>
        <span className="text-border">|</span>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>
      <ul className="space-y-3">
        {ingredients.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <Checkbox
              id={`ingredient-${i}`}
              checked={checked.has(i)}
              onCheckedChange={() => toggle(i)}
              className="mt-0.5"
            />
            <label
              htmlFor={`ingredient-${i}`}
              className={`text-sm cursor-pointer transition-colors ${
                checked.has(i) ? "line-through text-muted-foreground/50" : "text-muted-foreground"
              }`}
            >
              {item}
            </label>
          </li>
        ))}
      </ul>

      {/* Prominent print button above price estimates */}
      {checked.size > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <button
            onClick={handlePrint}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-foreground border border-border hover:bg-secondary transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print shopping list
          </button>
        </div>
      )}

      <SupermarketBasket checkedItems={ingredients.filter((_, i) => checked.has(i))} scaleFactor={scaleFactor} />
    </div>
  );
};

export default ShoppingList;
