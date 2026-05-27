import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import RequireAdmin from "./components/RequireAdmin";
import { AuthProvider } from "./hooks/useAuth";
// Index ships in the main bundle because it's the LCP-critical landing page;
// every other route is lazy so cold-start JS stays small.
import Index from "./pages/Index";
import { TILES_BY_SLUG } from "./lib/recipe-tiles";
import ExitIntentPopup from "./components/ExitIntentPopup";
import CookieConsent from "./components/CookieConsent";
import CanonicalRedirect from "./components/CanonicalRedirect";

const Work = lazy(() => import("./pages/Work"));
const About = lazy(() => import("./pages/About"));
const Styleguide = lazy(() => import("./pages/Styleguide"));
const Contact = lazy(() => import("./pages/Contact"));
const Recipes = lazy(() => import("./pages/Recipes"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const RegionPage = lazy(() => import("./pages/RegionPage"));
const Collections = lazy(() => import("./pages/Collections"));
const KitchenAtlas = lazy(() => import("./pages/KitchenAtlas"));
const MealPlanner = lazy(() => import("./pages/MealPlanner"));
const Guides = lazy(() => import("./pages/Guides"));
const GuideMotherSauces = lazy(() => import("./pages/GuideMotherSauces"));
const GuideFrenchTechniques = lazy(() => import("./pages/GuideFrenchTechniques"));
const GuideGaramMasala = lazy(() => import("./pages/GuideGaramMasala"));
const GuideHowToUseSpices = lazy(() => import("./pages/GuideHowToUseSpices"));
const GuideProperStock = lazy(() => import("./pages/GuideProperStock"));
const GuideProperSauce = lazy(() => import("./pages/GuideProperSauce"));
const GuideChoosingPans = lazy(() => import("./pages/GuideChoosingPans"));
const GuideKitchenKnives = lazy(() => import("./pages/GuideKitchenKnives"));
const GuideUnderstandingOliveOil = lazy(() => import("./pages/GuideUnderstandingOliveOil"));
const GuideHowToCookPasta = lazy(() => import("./pages/GuideHowToCookPasta"));
const GuideHowToMakeBread = lazy(() => import("./pages/GuideHowToMakeBread"));
const GuideWhatToCookInSummer = lazy(() => import("./pages/GuideWhatToCookInSummer"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
// Admin routes are lazy-loaded so their bundle isn't shipped to public visitors.
const AdminNewRecipe = lazy(() => import("./pages/AdminNewRecipe"));
const AdminRecipes = lazy(() => import("./pages/AdminRecipes"));
const AdminEditRecipe = lazy(() => import("./pages/AdminEditRecipe"));
const AdminSeoStatus = lazy(() => import("./pages/AdminSeoStatus"));
const AdminTaggingAudit = lazy(() => import("./pages/AdminTaggingAudit"));
const AdminChallenges = lazy(() => import("./pages/AdminChallenges"));

const RouteFallback = () => (
  <div className="container mx-auto px-6 py-20 text-sm text-muted-foreground">Loading…</div>
);

const AdminFallback = RouteFallback;

const queryClient = new QueryClient();

// Legacy slugs that were renamed entirely (old slug -> current slug).
// Applied AFTER normalising punctuation, so keys here are the normalised form.
const legacyRecipeSlugMap: Record<string, string> = {
  "sirloin-steak-with-peppercorn-sauce": "steak-au-poivre-and-french-fries-with-green-salad",
  "keema-rice": "savoury-rice",
  "creme-br-l-e": "creme-brle",
  "chorizo-and-chicken-tapa": "chorizo-and-chicken-tapas",
};

// Normalise a slug to match the canonical DB slug format:
// lowercase, URL-decoded, strip diacritics/punctuation (commas, ampersands,
// accented characters), collapse repeated dashes.
const normaliseSlug = (slug: string) => {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    decoded = slug;
  }
  return decoded
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const getCanonicalRecipeSlug = (slug?: string) => {
  if (!slug) return "";
  const normalised = normaliseSlug(slug);
  return legacyRecipeSlugMap[normalised] ?? normalised;
};

const RecipeDetailRoute = () => {
  const { slug } = useParams<{ slug: string }>();

  return <RecipeDetail key={slug ?? "recipe-detail"} />;
};

const LegacyRecipeRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/recipes/${getCanonicalRecipeSlug(slug)}`} replace />;
};

const CanonicalRecipeSlugRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  const canonicalSlug = getCanonicalRecipeSlug(slug);

  // If the slug matches a category tile, render the category landing instead
  // of treating it as a recipe-detail slug.
  if (slug && TILES_BY_SLUG[slug]) {
    return <CategoryPage key={slug} />;
  }

  if (!slug || canonicalSlug === slug) {
    return <RecipeDetail key={slug ?? "recipe-detail"} />;
  }

  return <Navigate to={`/recipes/${canonicalSlug}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CanonicalRedirect />
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/work" element={<Work />} />
              <Route path="/about" element={<About />} />
              <Route path="/styleguide" element={<Styleguide />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/category/:slug" element={<CategoryPage />} />
              <Route path="/recipes/region/:regionId" element={<RegionPage />} />
              <Route path="/recipes-1/:slug" element={<LegacyRecipeRedirect />} />
              <Route path="/recipes-1-1/:slug" element={<LegacyRecipeRedirect />} />
              <Route path="/recipes/:slug" element={<CanonicalRecipeSlugRedirect />} />
              {/* Legacy top-level recipe URLs with no current equivalent → send to recipes listing */}
              <Route path="/pork-curry-with-" element={<Navigate to="/recipes" replace />} />
              <Route path="/lamb-and-apricot-biryani" element={<Navigate to="/recipes" replace />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:slug" element={<Collections />} />
              <Route path="/kitchen-atlas" element={<KitchenAtlas />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/mother-sauces" element={<GuideMotherSauces />} />
              <Route path="/guides/french-techniques" element={<GuideFrenchTechniques />} />
              <Route path="/guides/garam-masala" element={<GuideGaramMasala />} />
              <Route path="/guides/how-to-use-spices" element={<GuideHowToUseSpices />} />
              <Route path="/guides/proper-stock" element={<GuideProperStock />} />
              <Route path="/guides/proper-sauce" element={<GuideProperSauce />} />
              <Route path="/guides/choosing-pans" element={<GuideChoosingPans />} />
              <Route path="/guides/kitchen-knives" element={<GuideKitchenKnives />} />
              <Route path="/guides/understanding-olive-oil" element={<GuideUnderstandingOliveOil />} />
              <Route path="/guides/how-to-cook-pasta" element={<GuideHowToCookPasta />} />
              <Route path="/guides/how-to-make-bread" element={<GuideHowToMakeBread />} />
              <Route path="/guides/what-to-cook-in-summer" element={<GuideWhatToCookInSummer />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/admin/recipes"
                element={<RequireAdmin><Suspense fallback={<AdminFallback />}><AdminRecipes /></Suspense></RequireAdmin>}
              />
              <Route
                path="/admin/recipes/new"
                element={<RequireAdmin><Suspense fallback={<AdminFallback />}><AdminNewRecipe /></Suspense></RequireAdmin>}
              />
              <Route
                path="/admin/recipes/:slug/edit"
                element={<RequireAdmin><Suspense fallback={<AdminFallback />}><AdminEditRecipe /></Suspense></RequireAdmin>}
              />
              <Route
                path="/admin/seo"
                element={<RequireAdmin><Suspense fallback={<AdminFallback />}><AdminSeoStatus /></Suspense></RequireAdmin>}
              />
              <Route
                path="/admin/tagging-audit"
                element={<RequireAdmin><Suspense fallback={<AdminFallback />}><AdminTaggingAudit /></Suspense></RequireAdmin>}
              />
              <Route path="/admin/challenges" element={<RequireAdmin><Suspense fallback={<AdminFallback />}><AdminChallenges /></Suspense></RequireAdmin>} />
              <Route path="/privacy" element={<Privacy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ExitIntentPopup />
          <CookieConsent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
