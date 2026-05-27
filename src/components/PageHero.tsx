interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  imageId: string;
  imageAlt: string;
}

const pexels = (id: string, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=${w}`;
const pexelsSrcSet = (id: string, widths: number[]) =>
  widths.map((w) => `${pexels(id, w)} ${w}w`).join(", ");

const PageHero = ({ title, subtitle, eyebrow, imageId, imageAlt }: PageHeroProps) => {
  const image = pexels(imageId, 1600);
  const srcSet = pexelsSrcSet(imageId, [768, 1200, 1600, 2000]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={image}
          srcSet={srcSet}
          sizes="100vw"
          alt={imageAlt}
          fetchPriority="high"
          decoding="async"
          width={1600}
          height={900}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.dataset.fallback === "true") return;
            img.dataset.fallback = "true";
            img.removeAttribute("srcset");
            img.src = "/placeholder.svg";
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
      </div>
      <div className="relative container mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 max-w-3xl text-primary-foreground">
        {eyebrow && (
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-4 opacity-90">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-5">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
