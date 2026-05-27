import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SAUCES = [
  {
    id: "bechamel",
    name: "Béchamel",
    intro:
      "The simplest and most useful of the five. Butter, flour and milk — nothing else. The technique is everything.",
    method:
      "Melt butter in a heavy pan over a medium heat. Add plain flour and stir continuously for a full two minutes. This step — cooking out the flour — is what separates a good Béchamel from a floury, stodgy one. Do not rush it. Add warm milk gradually, whisking constantly, until the sauce thickens to a consistency that coats the back of a spoon. Season with salt, white pepper and a grating of fresh nutmeg.",
    uses: "Lasagne, cauliflower cheese, croque monsieur, fish pie, moussaka.",
    mistake:
      "Adding cold milk all at once and not cooking the flour long enough.",
  },
  {
    id: "veloute",
    name: "Velouté",
    intro:
      "Think of Velouté as Béchamel's more elegant sibling. The method is identical but instead of milk you use a good warm stock — chicken, fish or veal depending on what you are serving it with.",
    method:
      "Make a roux of butter and flour exactly as you would for Béchamel. Add your warm stock gradually, whisking until smooth and glossy. A good Velouté should be silky, light and deeply savoury.",
    uses: "As the base of cream sauces for chicken and fish, in pot pies, as a base for soups.",
    mistake:
      "Using a weak or salty stock cube instead of a proper homemade or quality bought stock. The sauce is only as good as what goes into it.",
  },
  {
    id: "espagnole",
    name: "Espagnole",
    intro:
      "The most ambitious of the five and the one most home cooks never attempt. That is exactly why you should.",
    method:
      "Start by roasting veal or beef bones until deeply coloured. Caramelise your vegetables — onion, carrot and celery — in the same pan. Add tomato paste and cook until it darkens. Add your dark roux and stock and simmer for two to three hours, skimming regularly.",
    uses: "As the base for Bordelaise, Chasseur and Périgueux sauces. As a braising liquid for beef, lamb and venison.",
    mistake:
      "Not roasting the bones and vegetables long enough. The colour you build in the roasting tin is the flavour in the finished sauce.",
  },
  {
    id: "hollandaise",
    name: "Hollandaise",
    intro:
      "The most technically demanding of the five — and the one that will make you feel most like a proper cook when you nail it.",
    method:
      "Whisk egg yolks with a splash of water over barely simmering water in a bain marie until thick and ribbony. Remove from the heat. Add clarified butter drop by drop at first, whisking constantly, then in a thin stream as the emulsion takes hold. Season with lemon juice, salt and a pinch of cayenne.",
    uses: "Eggs Benedict, asparagus, poached fish, grilled steak.",
    mistake:
      "Adding the butter too quickly before the emulsion has formed. Patience at the start is everything.",
  },
  {
    id: "sauce-tomat",
    name: "Sauce Tomat",
    intro:
      "Not what you think. The French mother sauce Tomat bears little resemblance to a jar of Italian passata. It is a long-cooked, deeply savoury tomato sauce built on salt pork, aromatic vegetables and good stock.",
    method:
      "Render diced salt pork or pancetta in a heavy pan. Add onion, carrot and celery and cook gently until soft. Add a bay leaf, thyme, tomato paste and good ripe tomatoes. Add stock and simmer gently for at least an hour until the sauce is rich, thick and deeply flavoured. Pass through a sieve for a silky finish.",
    uses: "As a base for any tomato-forward dish, braised meats, stuffed vegetables, pasta sauces that need real depth.",
    mistake: "Rushing it. This sauce rewards patience above all else.",
  },
];

const GuideMotherSauces = () => {
  return (
    <Layout>
      <GuideSeo slug="mother-sauces" />

      <article className="bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "Mother sauces" },
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
              The five French mother sauces — and why every home cook should know them
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Master these five and you hold the keys to almost every classic sauce in western cuisine.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Every sauce in French cooking descends from five originals. They sound intimidating. They are not. Each one is built on simple ingredients and a small number of techniques. Learn them once and you will use them forever.
            </p>
          </div>
        </header>

        <GuideTOC items={SAUCES.map((s) => ({ id: s.id, label: s.name }))} />

        {/* Sauce sections */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl">
          {SAUCES.map((sauce, i) => (
            <section
              key={sauce.id}
              id={sauce.id}
              className={`scroll-mt-24 ${i > 0 ? "mt-16 pt-16 border-t border-border" : ""}`}
            >
              <p className="micro-caption mb-3 text-primary">Sauce {i + 1} of 5</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                {sauce.name}
              </h2>
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
                {sauce.intro}
              </p>

              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                How to make it
              </h3>
              <p className="text-base text-foreground/90 leading-relaxed mb-8">
                {sauce.method}
              </p>

              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                Where you will use it
              </h3>
              <p className="text-base text-foreground/90 leading-relaxed mb-8">
                {sauce.uses}
              </p>

              <div
                className="rounded-lg p-5 md:p-6 border border-border bg-warm-soft"
              >
                <p className="text-xs uppercase tracking-widest font-semibold mb-2 text-muted-foreground">
                  The mistake most home cooks make
                </p>
                <p className="text-base md:text-lg text-foreground">
                  {sauce.mistake}
                </p>
              </div>
            </section>
          ))}

          {/* Closing */}
          <div
            className="mt-16 rounded-lg p-6 md:p-8 border border-border bg-warm-soft"
          >
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              You do not need to make all five in one week. Pick one. Make it properly. Understand what you are doing and why. Then move to the next. Cook all five over a month and your kitchen confidence will be transformed.
            </p>
          </div>
        </div>

        <GuideRelatedRecipes guideSlug="mother-sauces" />

        {/* Kitchen Atlas CTA */}
        <section className="w-full py-16 md:py-20 border-t border-border bg-warm-dark text-warm-dark-foreground">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready for the French challenge?
            </h2>
            <p className="text-base md:text-lg mb-8 text-warm-cream-muted">
              Head to The Kitchen Atlas and take on the current French cooking challenge.
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

export default GuideMotherSauces;
