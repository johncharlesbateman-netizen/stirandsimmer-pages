import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  /** Display label, e.g. "Chicken" or "Chicken Tikka Masala". */
  label: string;
  /** Site-relative path. Omit for the current page (last item). */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Absolute origin used to build the BreadcrumbList JSON-LD URLs. */
  siteUrl?: string;
  className?: string;
}

const SITE = "https://stirandsimmer.co.uk";

/**
 * Semantic breadcrumb navigation + matching BreadcrumbList structured
 * data. The first item is always assumed to be "Home" so callers can
 * pass just the deeper trail if they prefer — but the convention used
 * across the site is to pass the full trail explicitly for clarity.
 */
const Breadcrumbs = ({ items, siteUrl = SITE, className = "" }: BreadcrumbsProps) => {
  if (!items.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `${siteUrl}${item.href}` }),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav
        aria-label="Breadcrumb"
        className={`text-sm text-muted-foreground ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground/50" aria-hidden />
                )}
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="hover:text-foreground transition-colors editorial-link"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-foreground/80 truncate max-w-[18ch] sm:max-w-none"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
