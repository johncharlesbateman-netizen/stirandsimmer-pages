import properStockImage from "@/assets/guide-proper-stock.jpg";
import properSauceImage from "@/assets/guide-proper-sauce.jpg";
import choosingPansImage from "@/assets/guide-choosing-pans.jpg";
import kitchenKnivesImage from "@/assets/guide-kitchen-knives.jpg";
import oliveOilImage from "@/assets/guide-understanding-olive-oil-hero.jpg";
import howToCookPastaImage from "@/assets/guide-how-to-cook-pasta-hero.jpg";
import howToMakeBreadImage from "@/assets/guide-how-to-make-bread-hero.jpg";
import whatToCookInSummerImage from "@/assets/guide-what-to-cook-in-summer-hero.jpg";

export const SITE_ORIGIN = "https://stirandsimmer.co.uk";
const AUTHOR = "Stir & Simmer";

const pexels = (id: string, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=${w}`;

const toAbsolute = (path: string) =>
  path.startsWith("http") ? path : `${SITE_ORIGIN}${path}`;

const stripSiteSuffix = (title: string) =>
  title.replace(/\s*[|—–-]\s*Stir\s*&\s*Simmer\s*$/i, "").trim();

export type GuideMeta = {
  slug: string;
  /** Page <title>, includes the "Stir & Simmer" site suffix. */
  title: string;
  /** Clean headline without the site suffix, used in schema/breadcrumbs. */
  name: string;
  description: string;
  image: string;
  url: string;
  publishedTime: string;
  modifiedTime: string;
  author: string;
};

type RawMeta = {
  slug: string;
  title: string;
  description: string;
  imageId?: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
};

const RAW: RawMeta[] = [
  {
    slug: "mother-sauces",
    title: "The five French mother sauces every home cook should know | Stir & Simmer",
    description:
      "Béchamel, Velouté, Espagnole, Hollandaise and Sauce Tomat — the five French mother sauces explained with step by step instructions and the mistakes to avoid.",
    imageId: "5908227",
    publishedTime: "2025-01-15T09:00:00Z",
  },
  {
    slug: "french-techniques",
    title: "French cooking techniques every home cook should know — Stir & Simmer",
    description:
      "Seven essential French cooking techniques explained simply — mise en place, julienne, brunoise, chiffonade, beurre blanc, flambé and déglaze. Master these and transform your cooking.",
    imageId: "4252137",
    publishedTime: "2025-02-01T09:00:00Z",
  },
  {
    slug: "garam-masala",
    title: "Garam masala — a cook's guide | Stir & Simmer",
    description:
      "Garam masala demystified — the spices that go in, why they matter, how to toast and grind them, and the mistakes most home cooks make.",
    imageId: "1340116",
    publishedTime: "2025-02-15T09:00:00Z",
  },
  {
    slug: "how-to-use-spices",
    title: "How to use spices — a beginner's guide | Stir & Simmer",
    description:
      "A beginner's guide to cooking with spices — what they do, how to store them, when to add them, and how to build flavour with confidence.",
    imageId: "2802527",
    publishedTime: "2025-03-01T09:00:00Z",
  },
  {
    slug: "proper-stock",
    title: "How to make a proper stock — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to making proper stock at home — what goes in, how long to simmer, the difference between white and brown stock, and how to use and store it.",
    image: properStockImage,
    publishedTime: "2025-03-15T09:00:00Z",
  },
  {
    slug: "proper-sauce",
    title: "How to make a proper sauce — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to making proper sauces at home — the building blocks, the techniques, and the small details that turn a thin pan liquid into something glossy and memorable.",
    image: properSauceImage,
    publishedTime: "2025-04-01T09:00:00Z",
  },
  {
    slug: "choosing-pans",
    title: "Choosing the right pan for the job — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to choosing the right pan for the job — the materials, the shapes, and which pans actually earn their place in a home kitchen.",
    image: choosingPansImage,
    publishedTime: "2025-04-15T09:00:00Z",
  },
  {
    slug: "kitchen-knives",
    title: "Kitchen knives — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to kitchen knives — the blades worth owning, how to hold them, how to keep them sharp, and how to choose ones that will last a lifetime.",
    image: kitchenKnivesImage,
    publishedTime: "2025-05-01T09:00:00Z",
  },
  {
    slug: "understanding-olive-oil",
    title: "Understanding olive oil — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to olive oil — what the labels mean, how it's made, when to cook with it, when to finish with it, and which bottles to buy in the UK.",
    image: oliveOilImage,
    publishedTime: "2025-05-18T09:00:00Z",
  },
  {
    slug: "how-to-cook-pasta",
    title: "How to cook pasta properly — a cook's guide | Stir & Simmer",
    description:
      "How to cook pasta properly — choosing the shape, salting the water, timing it right, saving the cooking water and finishing it in the sauce.",
    image: howToCookPastaImage,
    publishedTime: "2025-05-18T10:00:00Z",
  },
  {
    slug: "how-to-make-bread",
    title: "How to make bread at home — a beginner's guide | Stir & Simmer",
    description:
      "A beginner's guide to baking bread at home — the four ingredients, the flours, the yeasts, the method, the mistakes, and five loaves every home baker should try.",
    image: howToMakeBreadImage,
    publishedTime: "2025-05-18T11:00:00Z",
  },
  {
    slug: "what-to-cook-in-summer",
    title: "What to cook in summer — a seasonal guide | Stir & Simmer",
    description:
      "A seasonal guide to summer cooking in the UK — what's in season, how to build a proper salad, grilling done well, summer herbs, soft fruit, and five dishes every cook should know.",
    image: whatToCookInSummerImage,
    publishedTime: "2025-05-18T12:00:00Z",
  },
];

const DEFAULT_MODIFIED = "2025-05-16T09:00:00Z";

export const GUIDES_IN_ORDER: GuideMeta[] = RAW.map((r) => {
  const image = r.image ?? (r.imageId ? pexels(r.imageId, 1600) : "");
  return {
    slug: r.slug,
    title: r.title,
    name: stripSiteSuffix(r.title),
    description: r.description,
    image: toAbsolute(image),
    url: `${SITE_ORIGIN}/guides/${r.slug}`,
    publishedTime: r.publishedTime,
    modifiedTime: r.modifiedTime ?? DEFAULT_MODIFIED,
    author: AUTHOR,
  };
});

export const GUIDE_META: Record<string, GuideMeta> = Object.fromEntries(
  GUIDES_IN_ORDER.map((m) => [m.slug, m]),
);

export const getGuideMeta = (slug: string): GuideMeta => {
  const meta = GUIDE_META[slug];
  if (!meta) throw new Error(`Missing guide meta for slug: ${slug}`);
  return meta;
};
