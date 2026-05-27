// Curated recipe collections.
// `name` is stored verbatim in the `recipes.collections` text[] column,
// so it must match the values used by the auto-assignment seed.

import {
  UtensilsCrossed,
  Heart,
  Fish,
  Cake,
  Zap,
  Croissant,
  type LucideIcon,
} from "lucide-react";

export type CollectionSlug =
  | "italian-meals"
  | "romantic-meals"
  | "fish-and-seafood"
  | "sweets-and-desserts"
  | "quick-and-easy"
  | "baking-and-bread";

export interface CollectionDef {
  slug: CollectionSlug;
  /** Stored value in DB */
  name: string;
  /** Display title */
  title: string;
  tagline: string;
  description: string;
  /** Lucide icon used on tile */
  icon: LucideIcon;
  /** High-quality background image URL for the tile. */
  image: string;
}

// Curated Pexels imagery — photographed, on-topic and appetising.
export const collections: CollectionDef[] = [
  {
    slug: "italian-meals",
    name: "Italian Meals",
    title: "Italian Meals",
    tagline: "Quick midweek suppers to proper Sunday bowls",
    description:
      "From silky carbonara to creamy risotto and slow-cooked ragù — classic Italian dishes you can make at home.",
    icon: UtensilsCrossed,
    image:
      "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    slug: "romantic-meals",
    name: "Romantic Meals",
    title: "Romantic Meals",
    tagline: "Elegant plates for special occasions",
    description:
      "Fillet steaks, hand-dived scallops, soufflés and other show-stoppers for date night and celebrations.",
    icon: Heart,
    image:
      "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    slug: "fish-and-seafood",
    name: "Fish & Seafood",
    title: "Fish & Seafood",
    tagline: "Light, healthy and full of flavour",
    description:
      "Pan-fried scallops, prawn linguine, herb-crusted salmon and more — bright, flavourful seafood dishes.",
    icon: Fish,
    image:
      "https://images.pexels.com/photos/3296434/pexels-photo-3296434.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    slug: "sweets-and-desserts",
    name: "Sweets & Desserts",
    title: "Sweets & Desserts",
    tagline: "Treats to round off any meal",
    description:
      "Crème brûlée, sticky toffee pudding, soufflés and decadent cakes — sweet endings for every occasion.",
    icon: Cake,
    image:
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    slug: "quick-and-easy",
    name: "Quick & Easy",
    title: "Quick & Easy",
    tagline: "On the table in 30 minutes or less",
    description:
      "Minimal prep, short ingredient lists and simple techniques — for when you need dinner fast.",
    icon: Zap,
    image:
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    slug: "baking-and-bread",
    name: "Baking & Bread",
    title: "Baking & Bread",
    tagline: "Loaves, scones, biscuits and bakes",
    description:
      "Warm crusty bread, buttery scones, light sponges and crisp biscuits — straight from the oven.",
    icon: Croissant,
    image:
      "https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

export const collectionNames: string[] = collections.map((c) => c.name);

export const collectionBySlug: Record<CollectionSlug, CollectionDef> =
  Object.fromEntries(collections.map((c) => [c.slug, c])) as Record<
    CollectionSlug,
    CollectionDef
  >;

export const collectionByName: Record<string, CollectionDef> =
  Object.fromEntries(collections.map((c) => [c.name, c]));

export const isCollectionSlug = (s: string | undefined): s is CollectionSlug =>
  !!s && s in collectionBySlug;
