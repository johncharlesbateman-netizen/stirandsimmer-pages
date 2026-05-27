import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const GuideProperSauce = () => {
  return (
    <Layout>
      <GuideSeo slug="proper-sauce" />

      <article className="bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "How to make a proper sauce" },
              ]}
            />
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Guides
            </Link>
            <p className="micro-caption mb-4 text-primary">Guide</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-foreground mb-5">
              How to make a proper sauce
            </h1>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
              A great sauce is not an afterthought. It is the difference between a plate of food and a meal worth remembering. It is what turns a piece of chicken into something people ask you to make again. It is, in many ways, the whole point.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              The good news is that once you understand a handful of principles, making a proper sauce becomes less about following a recipe and more about instinct. You will start to see what every sauce has in common — and from there, you can make almost anything.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
              { id: "what-a-sauce-actually-does", label: "What a sauce actually does" },
              { id: "the-building-blocks", label: "The building blocks" },
              { id: "the-four-sauces-every-home-cook-should-know", label: "The four sauces every home cook should know" },
              { id: "how-to-make-a-pan-sauce", label: "How to make a pan sauce" },
              { id: "the-secrets-to-a-great-sauce", label: "The secrets to a great sauce" },
              { id: "common-mistakes-to-avoid", label: "Common mistakes to avoid" },
              { id: "a-note-on-stock", label: "A note on stock" },
          ]}
        />

        {/* What a sauce actually does */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="what-a-sauce-actually-does" className="font-display text-3xl md:text-4xl text-foreground mb-6">What a sauce actually does</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            A sauce has one job: to add flavour, moisture and cohesion to a dish. It should complement what it's served with, not compete with it. It should taste like it belongs on the plate — not like something that arrived separately and happens to be nearby.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            A good sauce should also have body. Not necessarily thick, but present. Something that coats rather than runs. That quality comes from reduction, from fat, from starch, or from gelatin — and often from a combination of all four.
          </p>
        </div>

        {/* The building blocks */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-building-blocks" className="font-display text-3xl md:text-4xl text-foreground mb-6">The building blocks</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Every sauce, however complex it looks, is built from a small number of elements:
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">A base</strong> — stock, wine, cream, tomatoes, butter. This is the foundation and it determines the character of everything that follows.
            </li>
            <li>
              <strong className="text-foreground">Aromatics</strong> — onion, shallot, garlic, celery, carrot. Cooked low and slow at the start to build sweetness and depth.
            </li>
            <li>
              <strong className="text-foreground">Acid</strong> — wine, vinegar, lemon juice. Acid lifts a sauce and stops it tasting flat. Almost every great sauce has some acid in it somewhere.
            </li>
            <li>
              <strong className="text-foreground">Fat</strong> — butter, cream, olive oil. Fat carries flavour and gives a sauce its richness and texture. Whisking cold butter into a finished sauce — a technique called <em>monter au beurre</em> — gives it a beautiful gloss and body without heaviness.
            </li>
            <li>
              <strong className="text-foreground">Seasoning</strong> — salt, pepper, and time. A sauce that tastes flat usually needs more salt, more reduction, or more time. Often all three.
            </li>
          </ul>
        </div>

        {/* The four sauces every home cook should know */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-four-sauces-every-home-cook-should-know" className="font-display text-3xl md:text-4xl text-foreground mb-6">The four sauces every home cook should know</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Pan sauce</strong> — the simplest and most useful sauce you can make. After searing meat, deglaze the pan with wine or stock, scraping up all the caramelised bits from the bottom. Reduce, finish with butter. Done in five minutes. Works with almost anything.
            </li>
            <li>
              <strong className="text-foreground">Béchamel</strong> — the great white sauce. Butter, flour, milk. The base of lasagne, cauliflower cheese, croque monsieur. Once you can make a béchamel without lumps, a whole category of dishes opens up.
            </li>
            <li>
              <strong className="text-foreground">Tomato sauce</strong> — not from a jar. A proper tomato sauce is onion, garlic, good tinned tomatoes, olive oil, time and patience. It should be sweet, slightly sharp and deeply savoury. It freezes beautifully and makes everything better.
            </li>
            <li>
              <strong className="text-foreground">Red wine reduction</strong> — the backbone of proper gravy and many braising sauces. Red wine, stock, aromatics, reduced until rich and glossy. Takes time but almost no skill.
            </li>
          </ul>
        </div>

        {/* How to make a pan sauce */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="how-to-make-a-pan-sauce" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to make a pan sauce</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
            This is the one to learn first. It uses the pan you've already cooked in, takes five to ten minutes, and produces something that tastes like it came from a restaurant kitchen.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            What you need
          </h3>
          <ul className="space-y-2 text-base md:text-lg text-foreground/90 leading-relaxed mb-8 list-disc pl-6">
            <li>The pan you just cooked meat in, with all its caramelised bits</li>
            <li>1 shallot, finely chopped</li>
            <li>150ml wine — red for beef and lamb, white for chicken and pork</li>
            <li>200ml good chicken or beef stock</li>
            <li>30g cold butter, cut into cubes</li>
            <li>Salt and pepper</li>
          </ul>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Method
          </h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Pour off most of the fat from the pan, leaving just a thin film. Set over a medium heat and add the shallot. Cook for two to three minutes until softened.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Pour in the wine. It will sizzle and steam — use a wooden spoon to scrape every caramelised bit from the bottom of the pan. This is where the flavour lives.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Let the wine reduce by half, then add the stock. Reduce again until the sauce has body — it should coat the back of a spoon.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Take the pan off the heat. Add the cold butter a cube at a time, swirling the pan constantly until each cube is incorporated. The sauce will become glossy and slightly thickened.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Season, taste, adjust. Serve immediately.
          </p>
        </div>

        {/* The secrets to a great sauce */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-secrets-to-a-great-sauce" className="font-display text-3xl md:text-4xl text-foreground mb-6">The secrets to a great sauce</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Reduce properly</strong> — most home cooks don't reduce their sauces enough. Reduction concentrates flavour and builds body. If your sauce tastes thin and watery, keep cooking.
            </li>
            <li>
              <strong className="text-foreground">Use cold butter at the end</strong> — this is one of the most useful techniques you can learn. Cold butter emulsifies into the sauce rather than splitting, giving it gloss and a velvety texture. Hot butter will split.
            </li>
            <li>
              <strong className="text-foreground">Taste constantly</strong> — a sauce that's nearly there might need a splash of acid, a pinch more salt, another minute of reduction. Taste it. Adjust it. Trust your palate.
            </li>
            <li>
              <strong className="text-foreground">Don't rush aromatics</strong> — onions and shallots cooked too fast taste sharp and raw. Given time and low heat they become sweet and mellow — a completely different ingredient.
            </li>
            <li>
              <strong className="text-foreground">Season in layers</strong> — season your aromatics when they go in, season again when you add liquid, and season again at the end. Each stage builds flavour differently.
            </li>
          </ul>
        </div>

        {/* Common mistakes to avoid */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="common-mistakes-to-avoid" className="font-display text-3xl md:text-4xl text-foreground mb-6">Common mistakes to avoid</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Adding stock straight from cold</strong> — always use warm or hot stock. Cold stock added to a hot pan lowers the temperature and stalls the reduction.
            </li>
            <li>
              <strong className="text-foreground">Boiling cream</strong> — cream added to a sauce should simmer gently, never boil hard. Boiling cream can split and produces a greasy, broken sauce.
            </li>
            <li>
              <strong className="text-foreground">Forgetting acid</strong> — a sauce that tastes good but somehow flat almost always needs acid. A squeeze of lemon, a splash of wine vinegar, a spoonful of Dijon mustard. Add a little, taste, adjust.
            </li>
            <li>
              <strong className="text-foreground">Over-thickening with cornflour</strong> — cornflour has its place but it can give a sauce a gluey, artificial texture if overused. Reduction and butter will almost always do a better job.
            </li>
          </ul>
        </div>

        {/* A note on stock */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="a-note-on-stock" className="font-display text-3xl md:text-4xl text-foreground mb-6">A note on stock</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            A sauce is only as good as its base. If you're using water and a cube, the ceiling is low. If you're using a good homemade stock, the ceiling disappears. This is why the{" "}
            <Link to="/guides/proper-stock" className="editorial-link text-foreground underline underline-offset-4 hover:no-underline">
              stock guide
            </Link>{" "}
            comes first — because everything that follows depends on it.
          </p>
        </div>

        <GuideRelatedRecipes guideSlug="proper-sauce" />

        {/* Kitchen Atlas CTA */}
        <section className="w-full py-16 md:py-20 border-t border-border bg-warm-dark text-warm-dark-foreground">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to put it to work?
            </h2>
            <p className="text-base md:text-lg mb-8 text-warm-cream-muted">
              Head to The Kitchen Atlas and explore recipes from around the world to practise on.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/kitchen-atlas">
                Visit The Kitchen Atlas <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-10 max-w-3xl">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all guides
          </Link>
        </div>
      </article>
    </Layout>
  );
};

export default GuideProperSauce;
