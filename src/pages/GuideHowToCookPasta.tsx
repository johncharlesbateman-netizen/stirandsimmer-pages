import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { SITE_ORIGIN } from "@/lib/guideMeta";
import heroImage from "@/assets/guide-how-to-cook-pasta-hero.webp";
import heroImageSrcSet from "@/assets/guide-how-to-cook-pasta-hero.webp?w=640;960;1280;1600&format=webp&as=srcset";

const GuideHowToCookPasta = () => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_ORIGIN}/guides` },
      {
        "@type": "ListItem",
        position: 3,
        name: "How to cook pasta properly",
        item: `${SITE_ORIGIN}/guides/how-to-cook-pasta`,
      },
    ],
  };

  return (
    <Layout>
      <GuideSeo slug="how-to-cook-pasta" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <article className="bg-background">
        {/* Hero image */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-muted">
          <img
            src={heroImage}
            srcSet={heroImageSrcSet}
            sizes="100vw"
            alt="Spaghetti being twirled in a pan of glossy tomato sauce with basil and parmesan"
            width={1600}
            height={900}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>

        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "How to cook pasta properly" },
              ]}
            />
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Guides
            </Link>
            <p className="micro-caption mb-4 text-primary">Kitchen Essentials</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-foreground mb-5">
              How to cook pasta properly — a cook's guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Pasta is the easiest meal in the world to cook and the easiest one to get wrong. The fixes are small, free and largely a matter of paying attention.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Done well, a plate of pasta is one of the great pleasures in cooking — glossy, properly seasoned, the sauce clinging to every strand. Done badly, it's bland, gluey and dressed in a puddle. The difference comes down to a handful of habits that take no extra time once you know them.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
            { id: "why-most-people-get-pasta-wrong", label: "Why most people get pasta wrong" },
            { id: "choosing-the-right-shape", label: "Choosing the right pasta shape for the sauce" },
            { id: "the-water", label: "The water — how much, how salty, how hot" },
            { id: "fresh-vs-dried", label: "Fresh vs dried — when each is right" },
            { id: "how-to-actually-cook-pasta", label: "How to actually cook pasta — timing, testing, draining" },
            { id: "pasta-water", label: "Pasta water — why you should always save it" },
            { id: "finishing-in-the-sauce", label: "Finishing pasta in the sauce — the most important step" },
            { id: "common-mistakes", label: "The most common pasta mistakes and how to fix them" },
            { id: "five-sauces", label: "Five pasta sauces every cook should know" },
          ]}
        />

        {/* Why most people get it wrong */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="why-most-people-get-pasta-wrong" className="font-display text-3xl md:text-4xl text-foreground mb-6">Why most people get pasta wrong</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Most home cooks treat pasta as two separate jobs — boil the noodles in one pan, make the sauce in another, then tip the drained pasta on top and stir. It works, technically. But it produces the dish you've eaten a thousand times: a mound of slippery pasta with sauce sliding off it and a watery pool at the bottom of the bowl.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Italian cooks treat it as one dish. The pasta finishes cooking in the sauce, the starchy water binds the two together, and the result is a single emulsified plate where the sauce clings to every strand. That's the whole secret. Everything in this guide is in service of that idea.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            The other big mistake is undersalting the water. Pasta seasoned only at the table tastes flat, no matter how good the sauce is. The water is your one chance to season the noodles from the inside.
          </p>
        </div>

        {/* Choosing the right shape */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="choosing-the-right-shape" className="font-display text-3xl md:text-4xl text-foreground mb-6">Choosing the right pasta shape for the sauce</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Pasta shapes aren't decorative — they exist because different sauces need different surfaces to cling to. A few rough rules will get you most of the way there.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Long, thin pasta</strong> (spaghetti, linguine, bucatini) — best with smooth, oily or seafood-based sauces that coat the strands. Think aglio e olio, vongole, carbonara, tomato and basil.
            </li>
            <li>
              <strong className="text-foreground">Long, flat pasta</strong> (tagliatelle, pappardelle, fettuccine) — built for rich meat ragùs and creamy sauces. The wide surface area carries body.
            </li>
            <li>
              <strong className="text-foreground">Short, tubular pasta</strong> (penne, rigatoni, paccheri) — perfect for chunky vegetable or meat sauces that need to lodge inside the tubes. Sausage ragù, arrabbiata, amatriciana.
            </li>
            <li>
              <strong className="text-foreground">Short, twisted or grooved pasta</strong> (fusilli, casarecce, orecchiette) — grabs onto pesto, broken sausage, broccoli, anything small enough to nestle into the curls.
            </li>
            <li>
              <strong className="text-foreground">Small soup pasta</strong> (ditalini, orzo, stelline) — for brothy dishes like minestrone or pasta e fagioli, where the pasta is part of a spoonable mixture.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mt-6">
            The Italian phrase is <em>la salsa sposa la pasta</em> — the sauce marries the pasta. If you find yourself with bolognese and angel hair, the marriage isn't going to work.
          </p>
        </div>

        {/* The water */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="the-water" className="font-display text-3xl md:text-4xl text-foreground mb-6">The water — how much, how salty, how hot</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Three rules, all easy to remember.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <li>
              <strong className="text-foreground">Plenty of it</strong> — at least a litre of water for every 100g of dried pasta. Crowded pasta sticks to itself and drops the water temperature when it goes in, which makes everything cook unevenly.
            </li>
            <li>
              <strong className="text-foreground">Properly salted</strong> — about 10g of salt per litre, or a heaped tablespoon. The water should taste like a mild sea — distinctly salty but not unpleasant. This is non-negotiable; pasta absorbs salt only from the water it's cooked in.
            </li>
            <li>
              <strong className="text-foreground">A rolling boil</strong> — not a gentle simmer. The pasta should be tumbling in the pan. Add salt after the water boils (it dissolves faster), then add the pasta and give it a single stir to stop it sticking.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Do not add oil to the water. It does nothing for sticking — that's what stirring is for — and it coats the pasta so the sauce won't grip later.
          </p>
        </div>

        {/* Fresh vs dried */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="fresh-vs-dried" className="font-display text-3xl md:text-4xl text-foreground mb-6">Fresh vs dried — when each is right</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Fresh pasta is not better than dried. They're different ingredients, suited to different dishes.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Dried pasta</strong> is made from durum wheat semolina and water. It has a firmer bite, holds its shape, and stands up to robust, oily and tomato-based sauces. Good bronze-die dried pasta (look for the words <em>trafilata al bronzo</em> on the packet) has a slightly rough surface that grips sauce beautifully. It's the right choice for the vast majority of weeknight cooking — and properly made, it's every bit as good as fresh.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Fresh pasta</strong> is made with soft "00" flour and eggs. It's softer, richer and more delicate. It belongs with butter, cream, slow-cooked meat ragù or filled shapes like ravioli and tortellini. It cooks in two to four minutes, not eight to ten.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Don't dress fresh egg pasta with a sharp tomato sauce or a fiery arrabbiata — the richness fights the acidity. And don't bother with fresh spaghetti for an aglio e olio; dried is the right call.
          </p>
        </div>

        {/* How to actually cook pasta */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="how-to-actually-cook-pasta" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to actually cook pasta — timing, testing, draining</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Get the water right, then pay attention to time. The packet timing is a starting point, not the truth. Set a timer for two minutes less than the packet says, then start tasting.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            You're looking for <em>al dente</em> — literally "to the tooth". The pasta should give cleanly when you bite through it, with a small pale core still visible in the middle of a snapped strand. It will keep cooking in its own residual heat and in the sauce, so pull it from the water while it still has a touch of bite. Mushy pasta is overcooked pasta, and there's no fixing it.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Don't tip pasta into a colander and shake it dry. Use tongs or a spider for long pasta, or a slotted spoon for shapes, and lift it straight from the water into the sauce pan. If you must drain, do it briefly and don't rinse. Rinsing washes off the surface starch — the very thing that helps the sauce cling.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            One exception: pasta destined for a cold salad should be drained and rinsed under cold water to stop the cooking and remove surface starch that would otherwise turn it gummy.
          </p>
        </div>

        {/* Pasta water */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="pasta-water" className="font-display text-3xl md:text-4xl text-foreground mb-6">Pasta water — why you should always save it</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Pasta cooking water is liquid gold. It's salted, starchy and hot — three properties that turn a thin pan sauce into something glossy and emulsified the moment you add a splash.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Before you drain, scoop out a mugful with a heatproof cup or ladle. Keep it nearby. You'll almost always want at least a few tablespoons; sometimes you'll want a lot more. The starch in the water acts as a binder between fat and water, the salt seasons the sauce, and the heat keeps everything moving.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Get into the habit of saving it every single time, even if you think the sauce looks fine. Pour the leftover down the sink afterwards if you don't use it. Forgetting to save it is one of the most common reasons home pasta tastes thinner and looser than the version in a good Italian restaurant.
          </p>
        </div>

        {/* Finishing in the sauce */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="finishing-in-the-sauce" className="font-display text-3xl md:text-4xl text-foreground mb-6">Finishing pasta in the sauce — the most important step</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            This is the single habit that separates home pasta from restaurant pasta. If you only change one thing about how you cook pasta, change this.
          </p>
          <ol className="space-y-3 text-base md:text-lg text-foreground/90 leading-relaxed list-decimal pl-6 mb-5">
            <li>Have your sauce warm and waiting in a wide, shallow pan — wide enough to hold the pasta in a single shallow layer.</li>
            <li>When the pasta is one minute short of al dente, lift it straight from the water into the sauce pan.</li>
            <li>Add a splash of pasta water — a few tablespoons to start.</li>
            <li>Turn the heat to medium and toss continuously for a minute or two. Use tongs, two spoons, or a swirl of the pan. The starch from the pasta and the water emulsifies the fat in the sauce, and the noodles finish cooking by absorbing the flavour around them.</li>
            <li>Add more pasta water as needed. The sauce should look glossy and cling to the pasta — not pooled at the bottom of the pan, not stiff and pasty. When it coats the back of a spoon and slides off slowly, it's right.</li>
            <li>Finish off the heat with cheese, butter or a final glug of olive oil if the recipe calls for it. Serve immediately. Pasta waits for no one.</li>
          </ol>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            This whole process — the Italians call it <em>mantecatura</em> — takes 60 to 90 seconds. It's the difference between sauce and pasta as two ingredients in the same bowl, and sauce and pasta as one dish.
          </p>
        </div>

        {/* Common mistakes */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="common-mistakes" className="font-display text-3xl md:text-4xl text-foreground mb-6">The most common pasta mistakes and how to fix them</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Undersalted water</strong> — the most frequent and most fixable mistake. Properly salt the water and the pasta will taste seasoned to the core, not just on the surface.
            </li>
            <li>
              <strong className="text-foreground">Oil in the boiling water</strong> — pointless. Coats the pasta, stops sauce from sticking. Skip it.
            </li>
            <li>
              <strong className="text-foreground">Overcooking</strong> — pull pasta a minute earlier than you think. It'll finish in the sauce.
            </li>
            <li>
              <strong className="text-foreground">Draining away the pasta water</strong> — always reserve a mugful before draining.
            </li>
            <li>
              <strong className="text-foreground">Rinsing under cold water</strong> — washes off the surface starch that helps the sauce cling. Only do this for cold pasta salads.
            </li>
            <li>
              <strong className="text-foreground">Sauce on top, not stirred through</strong> — toss the pasta in the sauce in the pan, not on the plate. A minute of finishing changes the whole dish.
            </li>
            <li>
              <strong className="text-foreground">Wrong shape for the sauce</strong> — a chunky ragù slides off spaghetti. A delicate clam sauce gets lost in penne. Match them.
            </li>
            <li>
              <strong className="text-foreground">Too much sauce</strong> — Italian portions of sauce are much smaller than you'd expect. The pasta is the dish, not the carrier. Aim for a light, even coat, not a swimming pool.
            </li>
          </ul>
        </div>

        {/* Five sauces */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="five-sauces" className="font-display text-3xl md:text-4xl text-foreground mb-6">Five pasta sauces every cook should know</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Learn these five and you've covered most of what a home cook needs. None of them takes longer than the pasta itself.
          </p>
          <ul className="space-y-5 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Aglio e olio</strong> — garlic, olive oil, chilli, parsley. Gently warm sliced garlic and a pinch of chilli flakes in plenty of good extra virgin until just golden. Toss with spaghetti and a splash of pasta water. The ultimate ten-minute dinner.
            </li>
            <li>
              <Link to="/recipes/cacio-e-pepe" className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary">Cacio e pepe</Link> — just pecorino, black pepper and pasta water. Crack a generous amount of pepper into a dry pan to toast, add pasta water, then toss with the noodles off the heat and a mountain of finely grated pecorino. The starch and cheese emulsify into a creamy coating. Tricky the first time, magic when it works.
            </li>
            <li>
              <strong className="text-foreground">Pomodoro</strong> — a proper tomato sauce. Soften a halved onion and a few garlic cloves in olive oil, add a tin of good plum tomatoes, crush them in the pan, simmer for 20 minutes with a torn basil leaf and a pinch of salt. Finish with butter off the heat for gloss. The benchmark.
            </li>
            <li>
              <strong className="text-foreground">Carbonara</strong> — guanciale (or pancetta), egg yolks, pecorino, black pepper. Render the cured pork until crisp. Whisk yolks with grated pecorino and pepper. Toss hot pasta in the pork fat, then off the heat with the egg mixture and a little pasta water until silky. Never use cream.
            </li>
            <li>
              <strong className="text-foreground">A simple ragù</strong> — onion, carrot, celery softened in olive oil; minced beef or pork browned hard; a splash of wine, a tin of tomatoes, a pinch of salt, a long slow simmer. An hour minimum, two is better. Pappardelle or tagliatelle, never spaghetti. Try our <Link to="/recipes/lamb-ragu" className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary">lamb ragù</Link> for a slow-cooked version, or <Link to="/recipes/spaghetti-bolognese" className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary">spaghetti bolognese</Link> for the classic everyday plate.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mt-6">
            Master these five and you'll never be more than 20 minutes away from a properly good dinner, even on a Tuesday.
          </p>
        </div>

        {/* Related guides */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">Related guides</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/guides/understanding-olive-oil" className="group block">
                <p className="micro-caption text-primary mb-1">Kitchen Essentials</p>
                <p className="font-display text-xl text-foreground group-hover:underline">Understanding olive oil — a cook's guide</p>
                <p className="text-base text-muted-foreground mt-1">The bottle you reach for matters as much as the pasta itself — when to use which oil, and why.</p>
              </Link>
            </li>
            <li>
              <Link to="/guides/choosing-pans" className="group block">
                <p className="micro-caption text-primary mb-1">Kitchen Essentials</p>
                <p className="font-display text-xl text-foreground group-hover:underline">Choosing the right pan — a cook's guide</p>
                <p className="text-base text-muted-foreground mt-1">A wide, shallow pan is what makes finishing pasta in the sauce work. Here's how to pick one.</p>
              </Link>
            </li>
          </ul>
        </section>

        <GuideRelatedRecipes guideSlug="how-to-cook-pasta" />

        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-10 max-w-3xl">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all guides
          </Link>
        </div>

        {/* Kitchen Atlas CTA */}
        <section className="w-full py-16 md:py-20 border-t border-border bg-warm-dark text-warm-dark-foreground">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Hungry now?
            </h2>
            <p className="text-base md:text-lg mb-8 text-warm-cream-muted">
              Head to The Kitchen Atlas and explore Italian recipes that put these techniques to work.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/kitchen-atlas">
                Visit The Kitchen Atlas <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default GuideHowToCookPasta;
