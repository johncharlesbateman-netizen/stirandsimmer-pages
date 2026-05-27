import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Technique = {
  id: string;
  name: string;
  french: string;
  what: string;
  how: string;
  where?: string;
  why?: string;
  mistake: string;
  summary: string;
};

const TECHNIQUES: Technique[] = [
  {
    id: "mise-en-place",
    name: "Mise en place",
    french: "Everything in its place.",
    summary: "Prep everything before you light the hob.",
    what:
      "Mise en place is not a technique in the traditional sense — it is a philosophy. Before you begin cooking, every ingredient is prepared, measured, peeled, chopped and placed in a small bowl or on a board ready to use. Nothing is left to do once the heat goes on.\n\nProfessional kitchens run entirely on this principle. A chef who reaches for an unpeeled onion while something is burning in the pan is a chef who has not done their mise en place.",
    how: "Read your recipe completely before you start. Prepare every ingredient before you turn on the hob. Chop your vegetables. Measure your spices. Have your stock warm. Separate your eggs. Then cook.",
    why: "Cooking becomes calmer, faster and more controlled. Mistakes happen when you are rushing to prepare ingredients while something already on the heat needs attention. Mise en place eliminates that entirely.",
    mistake:
      "Starting to cook before everything is ready. That half-prepared onion will cost you more time and stress than the five minutes of preparation would have taken.",
  },
  {
    id: "julienne",
    name: "Julienne",
    french: "To cut into thin matchsticks.",
    summary: "Long, uniform matchstick strips for quick, even cooking.",
    what:
      "Julienne is a knife cut that produces long, thin, uniform strips — typically around 5cm long and 2mm wide, resembling matchsticks. It is used for vegetables that need to cook quickly and evenly, or for garnishes that need visual precision.",
    how: "Start with a peeled vegetable — carrot, courgette, leek or celery work well. Cut it into sections about 5cm long. Slice each section lengthways into thin planks approximately 2mm thick. Stack the planks and slice again lengthways into thin strips of the same width. The result should be uniform matchsticks of equal length and thickness.",
    where:
      "Stir fries, Asian broths, garnishes for soups and salads, vegetable sides that need to cook in under two minutes.",
    mistake:
      "Rushing the cuts and producing uneven strips of different thicknesses. Uneven julienne cooks unevenly — some pieces will be raw while others are overdone. Take your time. Uniform cuts produce uniform results.",
  },
  {
    id: "brunoise",
    name: "Brunoise",
    french: "To cut into tiny, precise cubes.",
    summary: "Tiny 2mm cubes — the finest classical dice.",
    what:
      "Brunoise is the finest of the classical dice cuts — tiny cubes of approximately 2mm on each side. It takes julienne one step further: once you have your julienne strips, you simply cut across them at 2mm intervals to produce perfect miniature cubes.",
    how: "Follow the julienne method above to produce thin strips. Then gather the strips together and cut across them at the same 2mm interval you used for the strips themselves. The result is tiny uniform cubes.",
    where:
      "As a fine garnish for soups and consommés, in delicate sauces where you want flavour without visible chunks of vegetable, in fine dining presentations where precision signals care.",
    mistake:
      "Not taking julienne thin enough before cutting the brunoise. If your julienne strips are 4mm wide, your brunoise will be 4mm cubes — too large and no longer classical brunoise. The precision of the first cut determines the precision of everything that follows.",
  },
  {
    id: "chiffonade",
    name: "Chiffonade",
    french: "To cut leafy herbs or vegetables into fine ribbons.",
    summary: "Elegant fine ribbons of leafy herbs and greens.",
    what:
      "Chiffonade is the technique for cutting herbs and leafy vegetables — basil, mint, sage, spinach, sorrel — into fine, elegant ribbons rather than rough chopped pieces. It produces a more delicate result and releases the herb's flavour more gently than heavy chopping.",
    how: "Stack several leaves on top of each other. Roll them tightly into a cigar shape along the length of the leaf. Slice across the roll at fine intervals — 1 to 2mm for herbs, slightly wider for larger leaves like spinach or basil. Unroll the slices and you have fine ribbons.",
    where:
      "As a garnish for pasta, risotto, soups and bruschetta. As a finishing touch scattered over a dish at the last moment. Anywhere you want herb flavour and colour without heavy chopped pieces.",
    mistake:
      "Using a blunt knife and pressing down rather than slicing. A blunt knife bruises the herb, turns basil black within minutes and crushes the cellular structure that holds the flavour. Chiffonade demands a sharp knife used lightly.",
  },
  {
    id: "beurre-blanc",
    name: "Beurre blanc",
    french: "White butter sauce.",
    summary: "A silky emulsion of wine, shallots and cold butter.",
    what:
      "Beurre blanc is one of the great French butter sauces — a warm emulsion of white wine, vinegar, shallots and cold butter. It is silky, rich and intensely savoury. It sounds technical. It is achievable with patience.",
    how: "Finely dice two shallots and place in a small heavy pan with 100ml dry white wine and 50ml white wine vinegar. Reduce over a medium heat until almost completely evaporated — you want about two tablespoons of liquid remaining. Take the pan off the heat and allow to cool for one minute. Cut 200g cold unsalted butter into small cubes. Over the lowest possible heat, whisk the cold butter into the reduction one cube at a time. Each cube must be fully incorporated before the next goes in. The sauce should be creamy, pale and glossy. Season with salt and white pepper. Strain out the shallots if you prefer a smooth sauce.",
    where:
      "With fish — particularly sole, sea bass and salmon. With steamed asparagus. With scallops. With any delicate ingredient that benefits from a rich, acidic butter sauce.",
    mistake:
      "Adding the butter too quickly or letting the pan get too hot. If the pan is too hot the butter separates into greasy puddles rather than emulsifying. Keep the heat very low, add the butter slowly and if the sauce starts to look greasy remove the pan from the heat immediately and whisk in another cube of cold butter.",
  },
  {
    id: "flambe",
    name: "Flambé",
    french: "To flame.",
    summary: "Igniting alcohol to burn it off and concentrate flavour.",
    what:
      "Flambé is the technique of adding alcohol to a hot pan and igniting it to burn off the alcohol while leaving behind concentrated flavour. It is dramatic. It is also genuinely useful — the brief flame caramelises sugars and removes harsh alcohol notes, leaving a deeper, rounder flavour.",
    how: "Remove the pan from direct heat before adding alcohol — this is important for safety. Add a measure of brandy, Cognac, rum or other spirit. Return to the heat or tilt the pan towards a gas flame to ignite. Allow the flame to die down naturally — this takes about 30 seconds. Continue cooking.",
    where:
      "Crêpes Suzette, steak Diane, Christmas pudding, pan sauces for chicken and game, banana flambé.",
    mistake:
      "Adding too much alcohol or keeping the pan over high heat when adding it. Both increase the risk of an uncontrolled flame. Use a measure — not a free pour — and always remove from direct heat before adding the spirit.",
  },
  {
    id: "deglaze",
    name: "Déglaze",
    french: "To loosen the caramelised residue from the bottom of a pan using liquid.",
    summary: "Turning the dark pan crust into a sauce with liquid.",
    what:
      "When you sear meat or vegetables, a dark, sticky residue forms on the bottom of the pan. This is not burnt food — it is concentrated flavour. Deglazing dissolves this residue into a liquid to form the base of a sauce. It is one of the most valuable techniques in all of cooking and one of the most underused by home cooks.",
    how: "Remove the meat or vegetables from the pan. With the pan still hot, add a liquid — wine, stock, cider, beer or even water. It will sizzle and steam immediately. Use a wooden spoon or spatula to scrape every bit of the dark residue from the bottom of the pan as the liquid reduces. This residue dissolves completely into the liquid and becomes your sauce.",
    where:
      "Every time you sear or roast meat. Every time you want to make a pan sauce. Every time you roast vegetables and want something to drizzle over them.",
    mistake:
      "Washing the pan. The residue in the bottom of a pan after cooking is one of the most flavourful things in the kitchen. Never pour it down the sink.",
  },
];

const GuideFrenchTechniques = () => {
  return (
    <Layout>
      <GuideSeo slug="french-techniques" />

      <article className="bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "French techniques" },
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
              French cooking techniques every home cook should know
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              You do not need to train in a professional kitchen. But learning a handful of French techniques will transform the way you cook — and the way your food looks and tastes.
            </p>
          </div>
        </header>

        <GuideTOC items={TECHNIQUES.map((t) => ({ id: t.id, label: t.name }))} />

        {/* At a glance summary */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 pt-12 md:pt-16 max-w-3xl">
          <div className="rounded-lg p-6 md:p-8 border border-border bg-warm-soft">
            <p className="text-xs uppercase tracking-widest font-semibold mb-5 text-muted-foreground">
              At a glance — the seven techniques
            </p>
            <ul className="divide-y divide-border/60">
              {TECHNIQUES.map((t) => (
                <li
                  key={t.id}
                  className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 py-3"
                >
                  <span className="font-display text-base md:text-lg text-foreground">
                    {t.name}
                  </span>
                  <span className="text-sm md:text-base text-foreground/80">
                    {t.summary}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Intro */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-12 max-w-3xl">
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            French cuisine gave the world not just its greatest sauces but its greatest vocabulary. The techniques below are not complicated. They are precise. And precision, once learned, becomes instinct. Work through these one at a time and your cooking will quietly but fundamentally change.
          </p>
        </div>

        {/* Technique sections */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 pb-12 md:pb-16 max-w-3xl">
          {TECHNIQUES.map((t, i) => (
            <section
              key={t.id}
              id={t.id}
              className={`scroll-mt-24 ${i > 0 ? "mt-16 pt-16 border-t border-border" : ""}`}
            >
              <span className="inline-block text-xs uppercase tracking-widest font-semibold rounded-full px-3 py-1 mb-4 bg-warm-soft text-warm-amber">
                Technique {i + 1} of 7
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-1 scroll-mt-24">
                {t.name}
              </h2>
              <p className="italic text-sm md:text-base text-muted-foreground mb-6">
                {t.french}
              </p>

              {t.what.split("\n\n").map((para, idx) => (
                <p
                  key={idx}
                  className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6 last:mb-8"
                >
                  {para}
                </p>
              ))}

              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                {t.id === "mise-en-place" ? "How to apply it" : t.id === "beurre-blanc" ? "How to make it" : "How to do it"}
              </h3>
              <p className="text-base text-foreground/90 leading-relaxed mb-6">
                {t.how}
              </p>

              {t.why && (
                <>
                  <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                    Why it matters
                  </h3>
                  <p className="text-base text-foreground/90 leading-relaxed mb-6">
                    {t.why}
                  </p>
                </>
              )}

              {t.where && (
                <p className="italic text-sm md:text-base text-muted-foreground mb-6">
                  Where you will use it — {t.where}
                </p>
              )}

              <hr aria-hidden="true" className="border-0 h-px my-8 bg-warm-amber" />

              <div className="rounded-r-lg p-5 md:p-6 border-l-4 bg-warm-soft border-warm-amber">
                <p className="text-xs uppercase tracking-widest font-semibold mb-2 text-muted-foreground">
                  The mistake most home cooks make
                </p>
                <p className="text-base md:text-lg text-foreground">
                  {t.mistake}
                </p>
              </div>
            </section>
          ))}

          {/* Closing */}
          <div className="mt-16 rounded-lg p-6 md:p-8 border border-border bg-warm-soft">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              You do not need to learn all seven techniques this week. Pick the one that feels most relevant to how you cook right now. Mise en place will change your daily cooking immediately. Julienne will improve how your food looks. Beurre blanc will make you feel like a professional. Déglaze will transform every pan sauce you ever make. Come back to the others when you are ready. Each one is a small investment that pays back every time you cook.
            </p>
          </div>
        </div>

        <GuideRelatedRecipes guideSlug="french-techniques" />

        {/* Kitchen Atlas CTA */}
        <section className="w-full py-16 md:py-20 border-t border-border bg-warm-dark text-warm-dark-foreground">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to put these techniques into practice?
            </h2>
            <p className="text-base md:text-lg mb-8 text-warm-cream-muted">
              Head to The Kitchen Atlas and take on the current French cooking challenge — designed to use exactly these techniques in real dishes.
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

export default GuideFrenchTechniques;
