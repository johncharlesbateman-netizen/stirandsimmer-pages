import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { GUIDES_IN_ORDER, SITE_ORIGIN } from "@/lib/guideMeta";
import properStockImage from "@/assets/guide-proper-stock.webp";
import properStockSrcSet from "@/assets/guide-proper-stock.webp?w=400;600;800;1200&format=webp&as=srcset";
import properSauceImage from "@/assets/guide-proper-sauce.webp";
import properSauceSrcSet from "@/assets/guide-proper-sauce.webp?w=400;600;800;1200&format=webp&as=srcset";
import choosingPansImage from "@/assets/guide-choosing-pans.webp";
import choosingPansSrcSet from "@/assets/guide-choosing-pans.webp?w=400;600;800;1200&format=webp&as=srcset";
import kitchenKnivesImage from "@/assets/guide-kitchen-knives.webp";
import kitchenKnivesSrcSet from "@/assets/guide-kitchen-knives.webp?w=400;600;800;1200&format=webp&as=srcset";
import howToCookPastaImage from "@/assets/guide-how-to-cook-pasta-hero.webp";
import howToCookPastaSrcSet from "@/assets/guide-how-to-cook-pasta-hero.webp?w=400;600;800;1200&format=webp&as=srcset";
import howToMakeBreadImage from "@/assets/guide-how-to-make-bread-hero.webp";
import howToMakeBreadSrcSet from "@/assets/guide-how-to-make-bread-hero.webp?w=400;600;800;1200&format=webp&as=srcset";
import whatToCookInSummerImage from "@/assets/guide-what-to-cook-in-summer-hero.webp";
import whatToCookInSummerSrcSet from "@/assets/guide-what-to-cook-in-summer-hero.webp?w=400;600;800;1200&format=webp&as=srcset";

// Local fallback used if a remote (Pexels) card image fails to load.
const CARD_FALLBACK = properStockImage;

const pexels = (id: string, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=${w}`;
const pexelsSrcSet = (id: string, widths: number[]) =>
  widths.map((w) => `${pexels(id, w)} ${w}w`).join(", ");

const HERO_ID = "1340116"; // moody spices and herbs on dark wood
const heroImage = pexels(HERO_ID, 1600);
const heroSrcSet = pexelsSrcSet(HERO_ID, [768, 1200, 1600, 2000]);

type GuideEntry = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  imageId?: string;
  image?: string;
  imageSrcSet?: string;
  imageAlt: string;
};

const GUIDES: GuideEntry[] = [
  {
    slug: "mother-sauces",
    title: "The five French mother sauces — and why every home cook should know them",
    description:
      "Master these five and you hold the keys to almost every classic sauce in western cuisine.",
    eyebrow: "French Technique",
    imageId: "5908227", // saucepan with cream sauce
    imageAlt: "A glossy sauce being whisked in a saucepan",
  },
  {
    slug: "french-techniques",
    title: "French cooking techniques every home cook should know",
    description:
      "Seven essential French techniques — mise en place, julienne, brunoise, chiffonade, beurre blanc, flambé and déglaze — explained simply.",
    eyebrow: "French Technique",
    imageId: "4252137", // chef knife and chopped vegetables
    imageAlt: "Chef's knife and finely chopped vegetables on a wooden board",
  },
  {
    slug: "garam-masala",
    title: "Garam masala — a cook's guide",
    description:
      "The spices that go in, why they matter, how to toast and grind them, and the mistakes most home cooks make.",
    eyebrow: "Indian Technique",
    imageId: "1340116", // bowls of warm spices
    imageAlt: "Small bowls of warm Indian spices arranged on a dark surface",
  },
  {
    slug: "how-to-use-spices",
    title: "How to use spices — a beginner's guide",
    description:
      "What spices do, how to store them, when to add them, and how to build proper flavour with confidence.",
    eyebrow: "Spice Guide",
    imageId: "2802527", // spices in jars and spoons
    imageAlt: "An array of ground spices in spoons on a dark wooden table",
  },
  {
    slug: "proper-stock",
    title: "How to make a proper stock",
    description:
      "The quiet foundation of good cooking — bones, mirepoix, water and time, and how to turn them into something your sauces and soups can lean on.",
    eyebrow: "Technique",
    image: properStockImage,
    imageSrcSet: properStockSrcSet,
    imageAlt: "A pot of golden chicken stock simmering with bones, vegetables and herbs",
  },
  {
    slug: "proper-sauce",
    title: "How to make a proper sauce",
    description:
      "The building blocks, the techniques, and the small details that turn a thin pan liquid into something glossy, balanced and worth mopping up.",
    eyebrow: "Technique",
    image: properSauceImage,
    imageSrcSet: properSauceSrcSet,
    imageAlt: "A glossy dark pan sauce being whisked in a copper saucepan",
  },
  {
    slug: "choosing-pans",
    title: "Choosing the right pan for the job",
    description:
      "The materials, the shapes, and which pans actually earn their place in a home kitchen — a practical guide to building a collection that lasts.",
    eyebrow: "Equipment Guide",
    image: choosingPansImage,
    imageSrcSet: choosingPansSrcSet,
    imageAlt: "An overhead arrangement of cast iron, copper and stainless steel pans on a dark surface",
  },
  {
    slug: "kitchen-knives",
    title: "Kitchen knives — a cook's guide",
    description:
      "The blades worth owning, how to hold them, how to keep them sharp, and how to choose ones that will last a lifetime.",
    eyebrow: "Equipment Guide",
    image: kitchenKnivesImage,
    imageSrcSet: kitchenKnivesSrcSet,
    imageAlt: "An overhead arrangement of kitchen knives on a dark cutting board",
  },
  {
    slug: "understanding-olive-oil",
    title: "Understanding olive oil — a cook's guide",
    description:
      "What the labels actually mean, how it's made, when to cook with it, when to finish with it, and which bottles to buy in the UK.",
    eyebrow: "Kitchen Essentials",
    imageId: "33783",
    imageAlt: "A bottle of extra virgin olive oil and fresh olives on a dark wooden surface",
  },
  {
    slug: "how-to-cook-pasta",
    title: "How to cook pasta properly — a cook's guide",
    description:
      "How to choose the shape, salt the water, time it right, save the cooking water and finish it in the sauce — the small habits that change everything.",
    eyebrow: "Kitchen Essentials",
    image: howToCookPastaImage,
    imageSrcSet: howToCookPastaSrcSet,
    imageAlt: "Spaghetti being twirled in a pan of glossy tomato sauce with basil and parmesan",
  },
  {
    slug: "how-to-make-bread",
    title: "How to make bread at home — a beginner's guide",
    description:
      "The four ingredients, the flours, the yeasts, the method and the mistakes — everything you need to bake a proper loaf at home.",
    eyebrow: "Kitchen Essentials",
    image: howToMakeBreadImage,
    imageSrcSet: howToMakeBreadSrcSet,
    imageAlt: "A freshly baked rustic sourdough loaf with an open crumb, sliced on a dark wooden board",
  },
  {
    slug: "what-to-cook-in-summer",
    title: "What to cook in summer — a seasonal guide",
    description:
      "What's in season in the UK, how to build a proper salad, grilling done well, summer herbs, soft fruit and five dishes every cook should know.",
    eyebrow: "Seasonal",
    image: whatToCookInSummerImage,
    imageSrcSet: whatToCookInSummerSrcSet,
    imageAlt: "A sunlit summer table with grilled vegetables, ripe tomatoes, peaches, fresh herbs and a jug of iced drink",
  },
];

const Guides = () => {
  const collectionUrl = `${SITE_ORIGIN}/guides`;
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": collectionUrl,
    url: collectionUrl,
    name: "Guides — kitchen techniques and reference",
    description:
      "Practical kitchen guides from Stir & Simmer — techniques, reference and the craft behind great home cooking.",
    isPartOf: { "@type": "WebSite", name: "Stir & Simmer", url: SITE_ORIGIN },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: GUIDES_IN_ORDER.length,
      itemListElement: GUIDES_IN_ORDER.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: g.url,
        name: g.name,
      })),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: collectionUrl },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>Guides — kitchen techniques and reference | Stir & Simmer</title>
        <meta
          name="description"
          content="Practical kitchen guides from Stir & Simmer — techniques, reference and the craft behind great home cooking."
        />
        <link rel="canonical" href={collectionUrl} />
        <link rel="preload" as="image" href={heroImage} imageSrcSet={heroSrcSet} imageSizes="100vw" fetchPriority="high" />
        <script type="application/ld+json">{JSON.stringify(collectionJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            srcSet={heroSrcSet}
            sizes="100vw"
            alt="Warm spices, herbs and cookware arranged on a dark rustic surface"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
            className="w-full h-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-warm-dark/85 via-warm-dark/65 to-warm-dark/90" />
        </div>
        <div className="relative container mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 max-w-3xl text-warm-dark-foreground">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-4 text-warm-cream-muted">Guides</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-5">
            Kitchen guides
          </h1>
          <p className="text-lg md:text-xl text-warm-cream-muted max-w-2xl">
            Techniques, reference and the craft behind great home cooking — explained simply.
          </p>
        </div>
      </section>

      {/* Guide cards */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-5xl">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                to={`/guides/${g.slug}`}
                className="group relative block overflow-hidden border border-warm-dark/20 aspect-[3/2] md:aspect-[4/3] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                <img
                  src={g.image ?? pexels(g.imageId!, 800)}
                  srcSet={g.imageSrcSet ?? (g.image ? undefined : pexelsSrcSet(g.imageId!, [400, 600, 800, 1200]))}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={g.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={400}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src === CARD_FALLBACK) return;
                    img.srcset = "";
                    img.src = CARD_FALLBACK;
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-warm-dark/95 via-warm-dark/60 to-warm-dark/25 transition-opacity duration-500 group-hover:from-warm-dark group-hover:via-warm-dark/70"
                />
                <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end text-warm-dark-foreground">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-warm-cream-muted mb-3">
                    {g.eyebrow}
                  </p>
                  <h2 className="font-display text-xl md:text-2xl mb-3 leading-tight transition-transform duration-500 group-hover:translate-x-1">
                    {g.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-warm-cream-muted mb-5 line-clamp-3">
                    {g.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-warm-cream-muted group-hover:text-warm-dark-foreground transition-colors">
                    Read the guide
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Guides;
