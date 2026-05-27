import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const GuideHowToUseSpices = () => {
  return (
    <Layout>
      <GuideSeo slug="how-to-use-spices" />

      <article className="bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "How to use spices" },
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
              How to use spices — a beginner's guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Learn what spices do, how to handle them, and how to build proper flavour with confidence.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
              Spices are one of the most transformative things in a kitchen. A pinch of the right one at the right moment can turn something ordinary into something memorable. But for many home cooks, the spice rack is a graveyard of half-used jars bought for one recipe and never touched again.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              This guide is here to change that.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
              { id: "why-spices-matter", label: "Why spices matter" },
              { id: "whole-vs-ground", label: "Whole vs ground" },
              { id: "the-golden-rule-heat-activates-flavour", label: "The golden rule — heat activates flavour" },
              { id: "spices-every-home-cook-should-have", label: "Spices every home cook should have" },
              { id: "common-mistakes-to-avoid", label: "Common mistakes to avoid" },
              { id: "how-to-start-experimenting", label: "How to start experimenting" },
          ]}
        />

        {/* Why spices matter */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="why-spices-matter" className="font-display text-3xl md:text-4xl text-foreground mb-6">Why spices matter</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Spices don't just add heat. They add depth, warmth, earthiness, sweetness and complexity. They're the difference between a curry that tastes flat and one that tastes like it's been cooking all day. Understanding a few basics about how to use them will make everything you cook better.
          </p>
        </div>

        {/* Whole vs ground */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="whole-vs-ground" className="font-display text-3xl md:text-4xl text-foreground mb-6">Whole vs ground</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Most spices come in two forms — whole and ground.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Whole spices such as cumin seeds, coriander seeds and cardamom pods last longer, carry more flavour and release it when heated. They're ideal for tempering — dropping them into hot oil at the start of cooking to bloom their flavour before anything else goes in.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Ground spices are more convenient and better for blending into sauces, marinades and rubs. They lose their potency faster though — if a ground spice smells of nothing when you open the jar, it's past its best.
          </p>
        </div>

        {/* The golden rule */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-golden-rule-heat-activates-flavour" className="font-display text-3xl md:text-4xl text-foreground mb-6">The golden rule — heat activates flavour</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            This is the single most important thing to understand about spices. Heat unlocks their essential oils and transforms raw, dusty powder into something fragrant and alive.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            There are three main ways to do this:
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Dry toasting</strong> — add whole spices to a dry pan over medium heat and shake for 60 to 90 seconds until fragrant. Don't walk away — they burn fast. Use this before grinding or to finish a dish.
            </li>
            <li>
              <strong className="text-foreground">Blooming in oil</strong> — add ground or whole spices to hot oil at the start of cooking, before your onions or garlic. Give them 30 to 60 seconds. This is the foundation of most Indian and Middle Eastern cooking.
            </li>
            <li>
              <strong className="text-foreground">Adding mid-cook</strong> — stirring ground spices into onions or a sauce partway through. Less intense than blooming in oil but still effective.
            </li>
          </ul>
        </div>

        {/* Spices every home cook should have */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="spices-every-home-cook-should-have" className="font-display text-3xl md:text-4xl text-foreground mb-6">Spices every home cook should have</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            You don't need dozens. Start with these and you can make an enormous range of dishes:
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li><strong className="text-foreground">Cumin</strong> — earthy, warm, essential for curries, chilli and roasted vegetables.</li>
            <li><strong className="text-foreground">Coriander</strong> — citrusy and mild, pairs beautifully with cumin.</li>
            <li><strong className="text-foreground">Smoked paprika</strong> — adds depth and a gentle smokiness without heat.</li>
            <li><strong className="text-foreground">Turmeric</strong> — earthy and slightly bitter, gives dishes a golden colour.</li>
            <li><strong className="text-foreground">Chilli flakes</strong> — flexible heat you can control.</li>
            <li><strong className="text-foreground">Cinnamon</strong> — works in both sweet and savoury dishes.</li>
            <li>
              <strong className="text-foreground">Garam masala</strong> — a blended mix of warming spices added at the end of cooking to lift and finish a dish. Every region of India has its own version and every cook their own blend. For a full guide to what it is, how to make it and how to use it, see our dedicated{" "}
              <Link to="/guides/garam-masala" className="editorial-link text-foreground underline underline-offset-4 hover:no-underline">
                Garam Masala guide
              </Link>
              .
            </li>
          </ul>
        </div>

        {/* Common mistakes to avoid */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="common-mistakes-to-avoid" className="font-display text-3xl md:text-4xl text-foreground mb-6">Common mistakes to avoid</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li><strong className="text-foreground">Adding spices too late</strong> — raw ground spice added at the end of cooking tastes harsh and unfinished. Give them time and heat.</li>
            <li><strong className="text-foreground">Using old spices</strong> — ground spices lose their potency after 12 to 18 months. Smell the jar. If there's nothing there, bin it.</li>
            <li><strong className="text-foreground">Over-spicing</strong> — more is not always better. Build flavour gradually and taste as you go.</li>
            <li><strong className="text-foreground">Ignoring salt</strong> — spices and salt work together. Under-seasoned food will make even the best spice blend fall flat.</li>
          </ul>
        </div>

        {/* How to start experimenting */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="how-to-start-experimenting" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to start experimenting</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The best way to learn spices is to pick one dish and make it repeatedly, adjusting the spicing each time. A simple dal, a roasted chicken thigh, a tomato sauce — something you make often enough to notice the difference.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Once you understand how a spice behaves on its own, you'll start to see how it fits with others. That's when cooking starts to feel less like following instructions and more like genuine instinct.
          </p>
        </div>

        <GuideRelatedRecipes guideSlug="how-to-use-spices" />

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

export default GuideHowToUseSpices;
