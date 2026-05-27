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
import heroImage from "@/assets/guide-how-to-make-bread-hero.webp";
import heroImageSrcSet from "@/assets/guide-how-to-make-bread-hero.webp?w=640;960;1280;1600&format=webp&as=srcset";

const GuideHowToMakeBread = () => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_ORIGIN}/guides` },
      {
        "@type": "ListItem",
        position: 3,
        name: "How to make bread at home",
        item: `${SITE_ORIGIN}/guides/how-to-make-bread`,
      },
    ],
  };

  return (
    <Layout>
      <GuideSeo slug="how-to-make-bread" />
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
            alt="A freshly baked rustic sourdough loaf with an open crumb, sliced on a dark wooden board"
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
                { label: "How to make bread at home" },
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
              How to make bread at home — a beginner's guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Four ingredients, a bit of patience and a hot oven. Bread is one of the oldest and most forgiving things you can cook — and one of the most satisfying.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Once you've made a loaf you're properly proud of, the supermarket aisle never looks quite the same. The good news is that home bread is simpler than its reputation suggests. You don't need a stand mixer, a banneton, or a Dutch oven. You need flour, water, salt, yeast, a bowl and an oven that gets properly hot. Everything else is detail.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
            { id: "why-homemade-bread", label: "Why homemade bread is worth it" },
            { id: "four-ingredients", label: "The four ingredients — flour, water, yeast, salt" },
            { id: "understanding-flour", label: "Understanding flour — strong, plain, wholemeal, rye" },
            { id: "yeast", label: "Fresh yeast vs dried yeast vs instant — what to use" },
            { id: "basic-method", label: "The basic method — mixing, kneading, proving, shaping, baking" },
            { id: "dough-ready", label: "How to know when the dough is ready" },
            { id: "baking-bread", label: "Baking bread at home — temperature, steam, and timing" },
            { id: "common-mistakes", label: "The most common bread mistakes and how to fix them" },
            { id: "five-breads", label: "Five breads every home baker should try" },
          ]}
        />

        {/* Why homemade bread is worth it */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="why-homemade-bread" className="font-display text-3xl md:text-4xl text-foreground mb-6">Why homemade bread is worth it</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Most supermarket bread is built for shelf life, not flavour. The dough is mixed in minutes by a high-speed industrial process, pumped full of improvers and emulsifiers, and rushed through a single short rise. It's bread in name only — soft, sweet, oddly hollow, and stale before the day's out.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Real bread is the opposite. A long, slow ferment develops proper flavour, a crackling crust and a chewy open crumb. The ingredients cost pennies. The active hands-on time is barely twenty minutes spread across a day. The smell, when it comes out of the oven, is unbeatable.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            And once you've baked a few loaves, the technique becomes intuitive. You stop measuring as carefully. You start reading the dough by feel. You realise bread isn't a recipe so much as a relationship with four ingredients and time.
          </p>
        </div>

        {/* The four ingredients */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="four-ingredients" className="font-display text-3xl md:text-4xl text-foreground mb-6">The four ingredients — flour, water, yeast, salt</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Almost every bread on earth comes back to these four. Get them in roughly the right proportions and you have a loaf.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Flour</strong> — the structure. Strong bread flour has more protein, which forms gluten when worked with water. Gluten is the elastic web that traps the gas produced by the yeast.
            </li>
            <li>
              <strong className="text-foreground">Water</strong> — the activator. It hydrates the flour, dissolves the salt, and wakes up the yeast. Tap water is fine; if yours is heavily chlorinated, leave it out in a jug for half an hour first.
            </li>
            <li>
              <strong className="text-foreground">Yeast</strong> — the lift. A living organism that eats the sugars in the flour and produces carbon dioxide and a little alcohol, which together give bread its rise and much of its flavour.
            </li>
            <li>
              <strong className="text-foreground">Salt</strong> — the seasoning and the brake. It seasons the bread (an unsalted loaf tastes flat and lifeless) and slows the yeast down enough for flavour to develop properly. Use fine sea salt; don't skip it.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mt-6">
            A useful starting ratio for a basic white loaf, by weight: 500g flour, 350g water (70% hydration), 10g salt, 7g instant yeast. From there, you can vary everything.
          </p>
        </div>

        {/* Understanding flour */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="understanding-flour" className="font-display text-3xl md:text-4xl text-foreground mb-6">Understanding flour — strong, plain, wholemeal, rye</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            All flour is not the same. The protein content is what matters most for bread, because protein is what becomes gluten when you add water and work it.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <li>
              <strong className="text-foreground">Strong white bread flour</strong> (around 12–14% protein) — the workhorse. Use this for almost everything: white loaves, baguettes, pizza, focaccia, rolls. In the UK, look for Marriage's, Shipton Mill, Wessex Mill or even the supermarket's own strong white — all will give you a good loaf.
            </li>
            <li>
              <strong className="text-foreground">Plain (all-purpose) flour</strong> (around 9–10% protein) — too low in protein for proper bread. Fine for cakes, biscuits and pastry; not for loaves. You'll get a dense, tight crumb.
            </li>
            <li>
              <strong className="text-foreground">Wholemeal flour</strong> — strong flour milled from the whole grain, bran and germ included. Nuttier, denser, more nutritious. It absorbs more water than white flour, so increase hydration by around 5%. A 50/50 blend with strong white is a friendlier place to start than 100% wholemeal.
            </li>
            <li>
              <strong className="text-foreground">Rye flour</strong> — very low in gluten-forming protein, so it produces dense, dark, deeply flavoured loaves. Usually blended with strong white (10–30% rye) for lift. Wonderful with cheese, smoked fish or just butter.
            </li>
            <li>
              <strong className="text-foreground">"00" flour</strong> — finely milled Italian flour. Excellent for pizza and fresh pasta; not the right call for everyday bread.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Buy the best flour you can. Stone-ground flour from a small mill tastes noticeably better than industrial supermarket flour, and a 1.5kg bag costs the same as a sandwich.
          </p>
        </div>

        {/* Yeast */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="yeast" className="font-display text-3xl md:text-4xl text-foreground mb-6">Fresh yeast vs dried yeast vs instant — what to use</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            All three forms do the same job. The difference is convenience, shelf life and how you wake them up.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <li>
              <strong className="text-foreground">Instant (easy-bake) dried yeast</strong> — fine granules sold in 7g sachets or small tubs. Stir straight into the flour, no need to activate first. The easiest, most reliable choice for home bakers. This is what most modern recipes assume.
            </li>
            <li>
              <strong className="text-foreground">Active dry yeast</strong> — larger granules that need to be rehydrated in warm water (around 35°C, a touch warmer than blood temperature) with a pinch of sugar for 5–10 minutes before use. If it doesn't foam, the yeast is dead. Less common in UK supermarkets than instant.
            </li>
            <li>
              <strong className="text-foreground">Fresh yeast</strong> — a soft, putty-coloured block sold in chilled packs from good bakeries and some supermarket bakery counters (often free, if you ask). Crumble it into warm water with a pinch of sugar before adding. Use roughly 2.5 times the weight of instant yeast (so 18g fresh ≈ 7g instant). Lovely flavour, but keeps only about two weeks in the fridge.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Keep instant yeast in the freezer once opened — it stays alive for months. And resist the urge to add more yeast to speed things up. More yeast means faster rise but blander bread. Flavour comes from time, not from adding more of the bag.
          </p>
        </div>

        {/* The basic method */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="basic-method" className="font-display text-3xl md:text-4xl text-foreground mb-6">The basic method — mixing, kneading, proving, shaping, baking</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Every loaf in the world follows roughly the same five steps. Once you have them in your head, you can ad-lib.
          </p>
          <ol className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed list-decimal pl-6 mb-5">
            <li>
              <strong className="text-foreground">Mix.</strong> Combine flour, salt and yeast in a large bowl. Add the water (lukewarm, never hot — hot water kills yeast) and stir with a wooden spoon or your hand until you have a shaggy, sticky dough with no dry flour left. Cover and leave for 10 minutes. This rest, the <em>autolyse</em>, lets the flour hydrate properly and starts the gluten developing on its own.
            </li>
            <li>
              <strong className="text-foreground">Knead.</strong> Tip the dough onto a lightly floured surface and work it for 8–10 minutes — push it away with the heel of your hand, fold it back, turn 90°, repeat. It will go from rough and sticky to smooth, elastic and slightly tacky. Don't add too much extra flour; sticky doughs make better bread. (Or use the fold-in-the-bowl method: every 30 minutes for 2 hours, lift one side of the dough up and fold it over to the other. Less hands-on; just as effective.)
            </li>
            <li>
              <strong className="text-foreground">Prove (first rise).</strong> Put the dough in a lightly oiled bowl, cover with a damp cloth or cling film, and leave somewhere warm-ish (a normal room is fine) until roughly doubled in size. Usually 1.5–2 hours. A long, cool prove in the fridge overnight gives even better flavour.
            </li>
            <li>
              <strong className="text-foreground">Shape and prove again.</strong> Tip out, knock back gently (don't beat all the air out — fold it a few times), then shape into a tight round or oval. Place on a floured tray or in a tin, cover, and let it prove again until visibly puffed and almost doubled — usually 45–60 minutes.
            </li>
            <li>
              <strong className="text-foreground">Bake.</strong> Slash the top with a sharp knife (this directs the rise), and bake in a properly hot oven — 230°C / 210°C fan for the first 15 minutes, then 200°C / 180°C fan until deeply golden and hollow-sounding when tapped underneath. Usually 30–40 minutes total. Cool on a wire rack for at least 20 minutes before slicing.
            </li>
          </ol>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Active time is maybe 25 minutes. The rest is the dough doing the work while you do something else.
          </p>
        </div>

        {/* How to know when the dough is ready */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="dough-ready" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to know when the dough is ready</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Recipes give you times — "prove for 1 hour, knead for 10 minutes". They're a guide, not the truth. Your kitchen's temperature, your flour, your yeast and your hands all change the maths. Learn to read the dough instead.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">After kneading</strong>, the dough should feel smooth, elastic and slightly tacky — not sticky. Try the <em>windowpane test</em>: tear off a small piece and gently stretch it between your fingers. If it stretches thin enough to see light through it without tearing, the gluten is properly developed. If it rips immediately, knead a couple more minutes.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">After the first prove</strong>, the dough should be roughly doubled and feel soft and pillowy. Press a finger gently into it; the dent should spring back slowly and incompletely. If it springs back instantly, give it longer. If it stays put with no spring at all, it's overproved — knock it back and shape immediately.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            <strong className="text-foreground">After the second prove</strong>, the shaped loaf should look visibly puffed and feel light when you tip the tray. A gentle poke on the side leaves a dent that fills back in slowly. Now's the moment for the oven.
          </p>
        </div>

        {/* Baking bread at home */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="baking-bread" className="font-display text-3xl md:text-4xl text-foreground mb-6">Baking bread at home — temperature, steam, and timing</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Bread wants a hotter oven than most home cooks give it. Preheat properly — at least 20 minutes at 230°C / 210°C fan — and don't open the door for the first 15 minutes. That initial blast of heat is what gives you the dramatic rise bakers call <em>oven spring</em>.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Steam is the secret.</strong> Professional bakery ovens inject steam at the start of the bake, which keeps the surface of the dough soft and stretchy long enough for the bread to expand fully. The crust then crisps and colours beautifully. At home, you can fake it in two easy ways:
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <li>
              <strong className="text-foreground">The roasting tin trick.</strong> Put an empty metal tin on the bottom shelf as the oven heats. When the loaf goes in, pour a mugful of boiling water into the hot tin and slam the door shut. Steam fills the oven for the crucial first 10 minutes.
            </li>
            <li>
              <strong className="text-foreground">The Dutch oven method.</strong> Bake the loaf inside a preheated cast-iron casserole with the lid on for the first 20 minutes. The dough's own moisture creates a steam-rich micro-oven. Take the lid off for the last 15 minutes to colour the crust. This is the easiest route to a properly bakery-style loaf at home.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">How to know it's done.</strong> A properly baked loaf is deeply golden — almost a touch too dark by supermarket standards — and sounds hollow when tapped on the underside. If you want to be sure, the internal temperature should be 95–99°C. Underbaked bread has a gummy crumb; better to err on the side of a few extra minutes.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            And then the hardest step: let it cool. Bread is still cooking inside as it cools, and slicing it hot makes the crumb gummy and ruins the texture. Twenty minutes minimum on a rack. An hour for larger loaves.
          </p>
        </div>

        {/* Common mistakes */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="common-mistakes" className="font-display text-3xl md:text-4xl text-foreground mb-6">The most common bread mistakes and how to fix them</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Killing the yeast with hot water</strong> — water above about 50°C kills it. Lukewarm (cooler than a bath) is the rule. When in doubt, use cool water and prove longer.
            </li>
            <li>
              <strong className="text-foreground">Too much flour during kneading</strong> — sticky dough panics most first-timers, so they keep dusting. A wetter dough makes lighter bread with a more open crumb. Trust it; use a dough scraper instead of more flour.
            </li>
            <li>
              <strong className="text-foreground">Skipping the salt</strong> — or forgetting it. Unsalted bread tastes lifeless and proves too fast. Always weigh it.
            </li>
            <li>
              <strong className="text-foreground">Underproving</strong> — pulling the dough too early. The loaf comes out dense and tight, with little dimples that don't fill out. Be patient; let it double properly.
            </li>
            <li>
              <strong className="text-foreground">Overproving</strong> — leaving the second prove too long. The loaf collapses in the oven, or comes out with a sour smell and a coarse open crumb. Don't go past the point where a gentle poke fills back in slowly.
            </li>
            <li>
              <strong className="text-foreground">Oven not hot enough</strong> — most home ovens run cooler than the dial says. If your bread is pale and flat, push the temperature up by 10–15°C and preheat for longer.
            </li>
            <li>
              <strong className="text-foreground">No steam</strong> — bread baked dry has a thick, dull crust and doesn't rise properly. Use the roasting tin trick or a Dutch oven every time.
            </li>
            <li>
              <strong className="text-foreground">Slicing it hot</strong> — the most heartbreaking error. The crumb goes gummy, the crust softens, the bread is never as good as it could have been. Wait.
            </li>
          </ul>
        </div>

        {/* Five breads */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="five-breads" className="font-display text-3xl md:text-4xl text-foreground mb-6">Five breads every home baker should try</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Once the basic loaf is under your belt, these five will see you most of the way. Each one teaches something slightly different.
          </p>
          <ul className="space-y-5 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">A simple white loaf</strong> — the foundation. Strong white flour, instant yeast, salt, water. Made in a tin or as a free-form round. Master this and you have a loaf for sandwiches, toast and the freezer. Make it weekly and you'll never look back.
            </li>
            <li>
              <strong className="text-foreground">Focaccia</strong> — the most forgiving bread in the world. A very wet dough (around 80% hydration) poured into an oiled tray, dimpled with your fingertips, scattered with rosemary and flaky salt, drenched in olive oil and baked hot. No kneading, no shaping, almost impossible to mess up. The perfect place to start.
            </li>
            <li>
              <strong className="text-foreground">A no-knead loaf</strong> — Jim Lahey's famous method. Mix everything in a bowl, leave for 18 hours, shape briefly, prove again, bake in a Dutch oven. Five minutes of work and a bakery-quality crusty round at the end. The cheat code of bread.
            </li>
            <li>
              <strong className="text-foreground">Sourdough</strong> — the long game. No commercial yeast — just flour, water and a wild yeast starter you keep alive on the counter. The bread has tang, depth and a beautiful open crumb, and the process becomes oddly meditative. Worth it once you're comfortable with everything above.
            </li>
            <li>
              <strong className="text-foreground">Flatbreads</strong> — naan, pitta, chapati, tortilla. Mostly cooked on a screaming hot pan rather than in the oven, often the same day they're mixed. Quick, gratifying, and they teach you how dough behaves under direct heat.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mt-6">
            Bake one of these every other weekend for six months and you'll know more about bread than 95% of people. The rest is just repetition — and the slow, lifelong pleasure of getting a little bit better each time.
          </p>
        </div>

        {/* Related guides */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">Related guides</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/guides/how-to-cook-pasta" className="group block">
                <p className="micro-caption text-primary mb-1">Kitchen Essentials</p>
                <p className="font-display text-xl text-foreground group-hover:underline">How to cook pasta properly — a cook's guide</p>
                <p className="text-base text-muted-foreground mt-1">The other side of the carb coin — how to get a plate of pasta as good as your bread.</p>
              </Link>
            </li>
            <li>
              <Link to="/guides/understanding-olive-oil" className="group block">
                <p className="micro-caption text-primary mb-1">Kitchen Essentials</p>
                <p className="font-display text-xl text-foreground group-hover:underline">Understanding olive oil — a cook's guide</p>
                <p className="text-base text-muted-foreground mt-1">A drizzle of good oil on a slice of warm homemade bread is one of life's quiet pleasures. Here's how to pick the right bottle.</p>
              </Link>
            </li>
          </ul>
        </section>

        <GuideRelatedRecipes guideSlug="how-to-make-bread" heading="Recipes that use this skill" />

        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-10 max-w-3xl">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all guides
          </Link>
        </div>

        {/* Recipes CTA */}
        <section className="w-full py-16 md:py-20 border-t border-border bg-warm-dark text-warm-dark-foreground">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to start baking?
            </h2>
            <p className="text-base md:text-lg mb-8 text-warm-cream-muted">
              Browse our bread and baking recipes and put what you've just learned into practice.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/recipes">
                Browse Baking Recipes <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default GuideHowToMakeBread;
