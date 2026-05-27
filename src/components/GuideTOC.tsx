interface TocItem {
  id: string;
  label: string;
}

interface GuideTOCProps {
  items: TocItem[];
}

const GuideTOC = ({ items }: GuideTOCProps) => {
  if (!items.length) return null;
  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-10 max-w-3xl">
      <nav
        aria-label="In this guide"
        className="border border-border bg-muted/30 px-6 py-6 md:px-8 md:py-7"
      >
        <p className="micro-caption text-primary mb-4">In this guide</p>
        <ol className="space-y-2.5">
          {items.map((item, i) => (
            <li key={item.id} className="flex gap-3 text-base text-foreground/90 leading-snug">
              <span className="text-muted-foreground tabular-nums shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${item.id}`}
                className="editorial-link underline-offset-4 hover:underline transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default GuideTOC;
