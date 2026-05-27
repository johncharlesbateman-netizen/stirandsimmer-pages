import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import heroImage from "@/assets/guide-understanding-olive-oil-hero.webp";
import heroImageSrcSet from "@/assets/guide-understanding-olive-oil-hero.webp?w=640;960;1280;1600&format=webp&as=srcset";

const GuideUnderstandingOliveOil = () => {
  return (
    <Layout>
      <GuideSeo slug="understanding-olive-oil" />

      <article className="bg-background">
        {/* Hero image */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-muted">
          <img
            src={heroImage}
            srcSet={heroImageSrcSet}
            sizes="100vw"
            alt="Extra virgin olive oil being poured into a small white dish on a rustic wooden board, with green olives, rosemary and bread"
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
                { label: "Understanding olive oil" },
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
              Understanding olive oil — a cook's guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              The most misunderstood bottle in the kitchen. What the labels mean, when to cook with it, when to finish with it, and how to choose one that actually tastes of something.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Olive oil is the quiet workhorse of a good kitchen — used badly it's just fat, used well it's a seasoning in its own right. The difference comes down to knowing what you've bought, how it was made, and what you're using it for.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
            { id: "what-makes-olive-oil-different", label: "What makes olive oil different" },
            { id: "extra-virgin-vs-virgin-vs-light", label: "Extra virgin vs virgin vs light — what the labels actually mean" },
            { id: "how-olive-oil-is-made", label: "How olive oil is made" },
            { id: "flavour-profiles", label: "Flavour profiles — mild, medium, robust" },
            { id: "cooking-vs-finishing", label: "When to use olive oil for cooking vs finishing" },
            { id: "compared-to-other-oils", label: "How olive oil compares to other cooking oils" },
            { id: "smoke-point", label: "Smoke point — the truth" },
            { id: "how-to-store-olive-oil", label: "How to store olive oil properly" },
            { id: "how-to-taste-olive-oil", label: "How to taste olive oil like a professional" },
            { id: "best-olive-oils-uk", label: "The best olive oils to buy in the UK" },
          ]}
        />

        {/* What makes olive oil different */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="what-makes-olive-oil-different" className="font-display text-3xl md:text-4xl text-foreground mb-6">What makes olive oil different</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Almost every other cooking oil in the supermarket is a refined product — extracted with heat, solvents and bleaching, then deodorised into something neutral and shelf-stable. Sunflower, rapeseed, vegetable, groundnut. They're fats. They do a job.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Good olive oil is something else entirely. It's a fruit juice. The olives are crushed and the oil is pressed out mechanically, without heat or chemicals, and bottled. Nothing is added and nothing is taken away. What you taste in the glass is what came out of the fruit.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            That's why it has flavour — peppery, grassy, buttery, bitter, sometimes almost spicy at the back of the throat. And it's why it deserves to be treated as an ingredient rather than just a cooking medium.
          </p>
        </div>

        {/* Labels */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="extra-virgin-vs-virgin-vs-light" className="font-display text-3xl md:text-4xl text-foreground mb-6">Extra virgin vs virgin vs light — what the labels actually mean</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            The labels are regulated, even if they look like marketing fluff. Here's what each one actually means:
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Extra virgin olive oil</strong> — the top grade. Cold-pressed from fresh olives without heat or chemicals, with a free acidity of no more than 0.8 per cent and no detectable defects on tasting. This is the only grade worth buying for flavour.
            </li>
            <li>
              <strong className="text-foreground">Virgin olive oil</strong> — also mechanically pressed but with a higher acidity (up to 2 per cent) and some perceptible flavour defects. Rarely seen in UK supermarkets and not worth chasing.
            </li>
            <li>
              <strong className="text-foreground">Olive oil</strong> (no qualifier, sometimes labelled "pure") — a blend of refined olive oil with a small amount of virgin oil added back in for colour and flavour. Neutral, cheap, fine for high-heat frying but tastes of almost nothing.
            </li>
            <li>
              <strong className="text-foreground">Light olive oil</strong> — refined olive oil with even less virgin oil added. "Light" refers to flavour and colour, not calories. There is no reason to buy this; use rapeseed oil instead.
            </li>
            <li>
              <strong className="text-foreground">Pomace olive oil</strong> — extracted from the leftover olive paste using chemical solvents after the first press. Industrial-grade. Avoid.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mt-6">
            For everything in this guide, assume we're talking about extra virgin unless stated otherwise.
          </p>
        </div>

        {/* How it's made */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="how-olive-oil-is-made" className="font-display text-3xl md:text-4xl text-foreground mb-6">How olive oil is made</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Good extra virgin is made within hours of the olives leaving the tree. The fruit is washed, then crushed — stones, flesh and all — into a thick paste. The paste is slowly stirred to encourage the oil droplets to coalesce, then spun in a centrifuge to separate the oil from the water and solids.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            No heat. No chemicals. No filtration beyond a simple settling. The whole process, from picking to bottling, takes a day or two at a serious producer.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            The timing matters because olives start to oxidise the moment they're picked. The longer the gap between harvest and press, the duller and more acidic the oil. The best producers harvest early in the season when the fruit is still green and bitter — the oil is lower yielding but tastes vivid, peppery and alive.
          </p>
        </div>

        {/* Flavour profiles */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="flavour-profiles" className="font-display text-3xl md:text-4xl text-foreground mb-6">Flavour profiles — mild, medium, robust</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Extra virgin oils are usually grouped into three broad styles. Knowing which is which makes choosing the right bottle much easier.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Mild (delicate)</strong> — buttery, smooth, faintly grassy. Made from riper olives, often Ligurian or Provençal in origin. Good for mayonnaise, baking, delicate dressings and dishes where you don't want the oil to dominate.
            </li>
            <li>
              <strong className="text-foreground">Medium (fruity)</strong> — balanced, with green herb notes, a little bitterness and a gentle peppery finish. The most useful all-rounder. Tuscan and central Italian oils often sit here, as do many Spanish Arbequinas.
            </li>
            <li>
              <strong className="text-foreground">Robust (intense)</strong> — pungent, grassy, bitter and noticeably peppery at the back of the throat. Made from young, green olives, often Picual from southern Spain or Coratina from Puglia. Brilliant drizzled on bean soups, grilled bread, steak, even chocolate. Wasted on anything subtle.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mt-6">
            Most decent UK retailers now flag the style on the label. If they don't, the country and olive variety are good clues — Picual and Coratina lean robust, Arbequina and Frantoio lean medium, Taggiasca leans mild.
          </p>
        </div>

        {/* Cooking vs finishing */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="cooking-vs-finishing" className="font-display text-3xl md:text-4xl text-foreground mb-6">When to use olive oil for cooking vs finishing</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Most home cooks own one bottle and use it for everything. That's fine — but if you can stretch to two, you'll get more from your money.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">A cooking oil</strong> — a decent supermarket extra virgin, somewhere in the £6 to £10 a litre range. Use this for sautéing onions, roasting vegetables, frying eggs, the base of a tomato sauce. Anything where heat will mute the flavour anyway. Don't waste your good bottle on it.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">A finishing oil</strong> — a smaller, better bottle of single-estate or single-variety extra virgin, somewhere in the £15 to £30 a half-litre range. Use this raw, off the heat. A glug over a bowl of soup just before serving. Drizzled on grilled bread, burrata, tomatoes, white beans, roasted fish. Stirred into a dressing. A finishing oil belongs on dishes like our <Link to="/recipes/crab-spaghetti-with-tomato-caper-sauce" className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary">crab spaghetti with tomato and caper sauce</Link>, <Link to="/recipes/tuna-linguine-with-tomatoes-olives" className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary">tuna linguine with tomatoes and olives</Link>, or a <Link to="/recipes/warm-beef-salad" className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary">warm beef salad</Link> — anywhere a final raw glug will lift the whole plate. This is where olive oil earns its money.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Heat destroys the most volatile aromatic compounds — the grassy, peppery notes that you're paying for. If you're going to cook with the good stuff, add it at the end.
          </p>
        </div>

        {/* Compared to other oils */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="compared-to-other-oils" className="font-display text-3xl md:text-4xl text-foreground mb-6">How olive oil compares to other cooking oils</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Olive oil isn't the only bottle worth keeping in the cupboard. Every kitchen benefits from one or two neutral oils for the jobs extra virgin isn't suited to. Here's how the most common ones stack up.
          </p>
          <ul className="space-y-5 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Rapeseed oil</strong> — Britain's quiet workhorse. Cold-pressed rapeseed (often labelled "extra virgin" or sold under names like Yorkshire or Hillfarm) has a warm, golden, nutty flavour and a smoke point around 230°C. Use it for roasting, frying, mayonnaise and baking. Refined rapeseed — sold simply as "vegetable oil" or "rapeseed oil" in supermarkets — is neutral, cheap and has an even higher smoke point, which makes it the most reliable choice for deep-frying and high-heat searing. Better for the environment than imported oils too.
            </li>
            <li>
              <strong className="text-foreground">Sunflower oil</strong> — clean, neutral and high-smoking (around 225°C refined), which makes it a perfectly serviceable frying oil. Its strengths are blandness and price. The limitation is that it's almost entirely polyunsaturated, so it oxidises faster than olive or rapeseed when reused, and it brings nothing to the dish in terms of flavour. Fine for tempura, pastry where you want no taste at all, or filling a deep-fat fryer. There's rarely a reason to choose it over rapeseed.
            </li>
            <li>
              <strong className="text-foreground">Vegetable oil</strong> — a non-specific label that, in the UK, usually means refined rapeseed, sometimes blended with sunflower or soybean. It's neutral, cheap and stable up to around 220°C. Perfectly fine for frying chips, lining a roasting tin or greasing a cake tin. Just don't expect it to taste of anything, and check the back of the bottle if you care what's actually in it.
            </li>
            <li>
              <strong className="text-foreground">Avocado oil</strong> — the trendy one, and not without reason. Refined avocado oil has one of the highest smoke points of any culinary oil — around 270°C — which makes it genuinely useful for searing steak, blistering peppers or wok cooking at full heat. Unrefined (cold-pressed) avocado oil is greener, grassier and faintly buttery, and works well drizzled over salads or eggs. The catch is the price — three or four times that of rapeseed — and the carbon footprint of shipping it from Mexico or New Zealand. Worth a small bottle for high-heat work if you cook a lot of steak, but for most jobs a good extra virgin or a bottle of rapeseed will do the same work for less.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mt-6">
            A sensible everyday set-up: a litre of refined rapeseed for high-heat frying, a decent supermarket extra virgin for everyday cooking, and a smaller bottle of good single-estate extra virgin for finishing. That covers ninety-nine per cent of what a home cook actually needs.
          </p>
        </div>

        {/* Smoke point */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="smoke-point" className="font-display text-3xl md:text-4xl text-foreground mb-6">Smoke point — the truth</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            You'll often see it written that you should never cook with extra virgin olive oil because its smoke point is too low. This is one of the most persistent myths in modern cooking, and it's wrong.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Good extra virgin olive oil has a smoke point somewhere between 190°C and 210°C — comfortably above the temperature of a sauté pan, a baking tray of roast vegetables, or shallow frying. It's only an issue if you're searing a steak at full whack, deep-frying, or running a wok at restaurant temperatures. For those, use something neutral with a higher smoke point — refined rapeseed, groundnut, or sunflower.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            More importantly, recent research suggests extra virgin is actually one of the more stable oils when heated. Its high content of antioxidants and monounsaturated fats means it degrades less, not more, than many refined seed oils. Cook with it confidently.
          </p>
        </div>

        {/* Storage */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="how-to-store-olive-oil" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to store olive oil properly</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Olive oil has three enemies — light, heat and air. Manage those and the oil stays alive for months. Ignore them and a £20 bottle tastes like a £5 one within weeks.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li><strong className="text-foreground">Keep it dark</strong> — buy in dark glass or tin, and store in a cupboard, not on the worktop next to the hob. Clear bottles on a sunny shelf are a guarantee of stale oil.</li>
            <li><strong className="text-foreground">Keep it cool</strong> — a steady cupboard temperature is ideal. Don't refrigerate it; the oil clouds and the flavour stalls, though it isn't harmed.</li>
            <li><strong className="text-foreground">Keep it sealed</strong> — close the cap firmly after each use. Oxygen is what turns the oil rancid over time.</li>
            <li><strong className="text-foreground">Use it</strong> — extra virgin is best within 18 months of harvest and noticeably fresher within 12. Buy bottles that show a harvest date rather than just a best-before, and finish them within a few months of opening.</li>
          </ul>
        </div>

        {/* Tasting */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="how-to-taste-olive-oil" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to taste olive oil like a professional</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Professional tasters use a small blue glass — the colour is hidden on purpose, so you judge the oil on smell and flavour alone. You can do the same at home with a small tumbler.
          </p>
          <ol className="space-y-3 text-base md:text-lg text-foreground/90 leading-relaxed list-decimal pl-6 mb-5">
            <li>Pour a tablespoon into the glass.</li>
            <li>Warm it gently in your hand for thirty seconds — about body temperature — to release the aromas.</li>
            <li>Cover the top with your other hand, swirl, then take a long sniff. Look for grassy, herbal, tomato leaf, almond or freshly cut hay notes. Avoid anything that smells musty, vinegary, fusty or like crayons — those are defects.</li>
            <li>Take a small sip and draw air across it through your teeth (a technique called <em>strippaggio</em>). This vaporises the aromas across the back of your nose.</li>
            <li>Pay attention to three things — fruitiness on the front of the tongue, bitterness in the middle, and pepperiness at the back of the throat. All three are signs of a fresh, healthy oil. A cough is a good sign.</li>
          </ol>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Try two bottles side by side and the differences leap out. Once you've tasted a really good oil neat, you'll never look at a bottle of supermarket basics the same way again.
          </p>
        </div>

        {/* Best to buy in the UK */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="best-olive-oils-uk" className="font-display text-3xl md:text-4xl text-foreground mb-6">The best olive oils to buy in the UK</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            You don't need to spend a fortune to drink well, and you don't need to spend a fortune on olive oil either. Here's a rough hierarchy of what's worth buying in British supermarkets and delis at the time of writing.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">For everyday cooking (£6–£10 a litre)</h3>
          <ul className="space-y-3 text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            <li><strong className="text-foreground">Sainsbury's Taste the Difference Italian Extra Virgin</strong> — reliably fresh, well-balanced, fairly priced.</li>
            <li><strong className="text-foreground">M&amp;S Sicilian Extra Virgin</strong> — a touch more robust, good for roast vegetables and beans.</li>
            <li><strong className="text-foreground">Waitrose No.1 Greek Kalamata PDO</strong> — grassy, peppery and good value for a single-region oil.</li>
          </ul>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">For finishing (£15–£30 a half-litre)</h3>
          <ul className="space-y-3 text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            <li><strong className="text-foreground">Belazu Early Harvest</strong> — widely stocked in Waitrose and good delis. Bright, green, peppery. A reliable benchmark.</li>
            <li><strong className="text-foreground">Frantoio Franci "Villa Magra"</strong> — Tuscan, robust, intense. Found at Sous Chef and good Italian delis.</li>
            <li><strong className="text-foreground">Marqués de Griñón Oleum Artis</strong> — Spanish Picual, powerful and grassy. Brilliant on grilled bread.</li>
            <li><strong className="text-foreground">Castillo de Canena Family Reserve Arbequina</strong> — softer, almond-and-tomato style. Lovely on white fish.</li>
          </ul>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Where to look beyond supermarkets</h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Sous Chef, Natoora, Brindisa, The Fine Cheese Company and most independent Italian delis carry small-producer oils that supermarkets don't touch. The bottles cost more but the gap in quality is enormous, and a good half-litre will easily see out two or three months of finishing.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            One last rule — always check the harvest date on the back of the bottle. If it's more than 18 months old, walk away, no matter how fancy the label.
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
                <p className="text-base text-muted-foreground mt-1">A finishing glug of good olive oil is the last step in most Italian pasta dishes. Here's how to get the rest of it right.</p>
              </Link>
            </li>
            <li>
              <Link to="/guides/choosing-pans" className="group block">
                <p className="micro-caption text-primary mb-1">Kitchen Essentials</p>
                <p className="font-display text-xl text-foreground group-hover:underline">Choosing the right pan — a cook's guide</p>
                <p className="text-base text-muted-foreground mt-1">The right pan turns olive oil into a proper cooking medium. What to buy and what to skip.</p>
              </Link>
            </li>
          </ul>
        </section>

        <GuideRelatedRecipes guideSlug="understanding-olive-oil" />

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
              Ready to put it to work?
            </h2>
            <p className="text-base md:text-lg mb-8 text-warm-cream-muted">
              Head to The Kitchen Atlas and explore Italian, Spanish and Mediterranean recipes that show off a good bottle of oil.
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

export default GuideUnderstandingOliveOil;
