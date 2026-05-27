import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SECTIONS = [
  { id: "why-it-matters", label: "Why it matters" },
  { id: "the-knives-worth-owning", label: "The knives worth owning" },
  { id: "the-anatomy-of-a-knife", label: "The anatomy of a knife" },
  { id: "the-only-knives-you-actually-need", label: "The only knives you actually need" },
  { id: "blade-materials", label: "Blade materials" },
  { id: "german-vs-japanese", label: "German vs Japanese" },
  { id: "british-knives", label: "British knives — a proud heritage" },
  { id: "what-to-look-for-when-buying", label: "What to look for when buying" },
  { id: "how-to-hold-a-knife", label: "How to hold a knife" },
  { id: "keeping-your-knives-sharp", label: "Keeping your knives sharp" },
  { id: "storing-your-knives", label: "Storing your knives" },
  { id: "common-mistakes-to-avoid", label: "Common mistakes to avoid" },
  { id: "the-one-knife-rule", label: "The one knife rule" },
];

const GuideKitchenKnives = () => {
  return (
    <Layout>
      <GuideSeo slug="kitchen-knives" />

      <article className="bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "Kitchen knives — a cook's guide" },
              ]}
            />
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Guides
            </Link>
            <p className="micro-caption mb-4 text-primary">Equipment Guide</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-foreground mb-5">
              Kitchen knives — a cook's guide
            </h1>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
              A good knife is the most important tool in your kitchen. Not a stand mixer, not a food processor, not a mandoline. A knife. Everything else is optional. A sharp, well-chosen knife is not.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Most home cooks own too many knives and use too few. A block of eight knives that came as a set, half of which have never left the block. This guide will tell you what you actually need, how to choose it, and how to keep it sharp — because a blunt knife is more dangerous than a sharp one and far less useful.
            </p>
          </div>
        </header>

        <GuideTOC items={SECTIONS} />

        {/* Why it matters */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="why-it-matters" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            Why it matters
          </h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            A sharp, well-balanced knife does the work for you. Onions slip apart cleanly. Herbs are sliced rather than crushed. A chicken comes off the bone in confident strokes rather than a sawing struggle. The food tastes better because the cells are cut, not torn — and you cook better because chopping stops being a chore.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            A blunt knife, by contrast, is the most dangerous thing in the kitchen. It slips, it crushes, and it makes you press harder than you should. The single biggest upgrade most home cooks can make is not a new pan or a new gadget — it is a sharp knife.
          </p>
        </div>

        {/* The knives worth owning */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="the-knives-worth-owning" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            The knives worth owning
          </h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Three knives will do almost everything. Add to them only if you find a job they can't.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">A chef's knife (20–24cm)</strong> — the one you'll use for nine jobs out of ten. Chopping, slicing, dicing, mincing. A good chef's knife is the foundation of everything.
            </li>
            <li>
              <strong className="text-foreground">A paring knife (8–10cm)</strong> — for small, fiddly work. Topping strawberries, peeling shallots, deveining prawns, anything where a big blade is unwieldy.
            </li>
            <li>
              <strong className="text-foreground">A serrated bread knife (20–25cm)</strong> — for bread, obviously, but also tomatoes, soft fruit, and anything with a tough skin and a soft inside. The teeth do work no straight blade can.
            </li>
            <li>
              <strong className="text-foreground">A santoku (optional)</strong> — a Japanese-style alternative to the chef's knife, with a flatter edge and a lighter blade. Lovely for vegetables and fish if you prefer a more upright cutting style.
            </li>
            <li>
              <strong className="text-foreground">A boning or filleting knife (optional)</strong> — only worth it if you regularly break down whole birds or fish. Otherwise, a sharp chef's knife will cope.
            </li>
          </ul>
        </div>

        {/* The anatomy of a knife */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="the-anatomy-of-a-knife" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            The anatomy of a knife
          </h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Before choosing a knife it helps to understand what you're looking at.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Blade</strong> — the cutting edge. The shape, length and steel determine what the knife is best for.
            </li>
            <li>
              <strong className="text-foreground">Edge</strong> — the sharpened part of the blade. A good edge should be maintained regularly.
            </li>
            <li>
              <strong className="text-foreground">Spine</strong> — the thick, unsharpened top of the blade. Thicker spines add weight and stability.
            </li>
            <li>
              <strong className="text-foreground">Bolster</strong> — the thick junction between blade and handle on forged knives. Adds balance and protects the fingers.
            </li>
            <li>
              <strong className="text-foreground">Tang</strong> — the part of the blade that extends into the handle. A full tang — where the metal runs the full length of the handle — indicates a well-constructed knife.
            </li>
            <li>
              <strong className="text-foreground">Handle</strong> — comfort and grip matter more than aesthetics. A handle should feel secure when wet.
            </li>
          </ul>
        </div>

        {/* The only knives you actually need */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="the-only-knives-you-actually-need" className="font-display text-3xl md:text-4xl text-foreground mb-8 scroll-mt-24">
            The only knives you actually need
          </h2>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Chef's knife — 20cm to 25cm</h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-4">
            The single most important knife in the kitchen. A good chef's knife will handle 90 percent of everything you need to do — chopping, slicing, dicing, mincing, breaking down a chicken. If you buy one knife and one knife only, make it this.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
            Look for a blade between 20cm and 25cm depending on the size of your hands and your comfort level. Heavier German-style knives suit those who prefer a rocking motion. Lighter Japanese-style knives suit those who prefer a push cut.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Paring knife — 8cm to 10cm</h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
            For the detailed work a chef's knife is too large for — peeling, trimming, deseeding, precise cuts. A small, nimble blade that gives you control over delicate tasks.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Bread knife — serrated, 20cm to 25cm</h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
            The one knife where serration makes sense. A good bread knife will cut through a crusty loaf without crushing it, slice tomatoes without tearing them, and trim the layers of a cake. It rarely needs sharpening and lasts for years.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Boning knife — 15cm (optional)</h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Flexible or stiff depending on preference. Used for breaking down meat, removing skin and working around joints. Not essential unless you regularly butcher your own meat — but invaluable when you do.
          </p>
        </div>

        {/* Blade materials */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="blade-materials" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            Blade materials
          </h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Stainless steel</strong> — the standard for good reason. Holds a reasonable edge, resists rust and stains, easy to live with. Most quality home knives are stainless steel.
            </li>
            <li>
              <strong className="text-foreground">High-carbon stainless</strong> — the sweet spot for most cooks. Harder than basic stainless, takes a sharper edge, holds it longer. Slightly more expensive but well worth it.
            </li>
            <li>
              <strong className="text-foreground">Carbon steel</strong> — the chef's choice. Takes the keenest edge of any common steel, sharpens easily, but rusts if you leave it wet. Develops a patina with age that some cooks love and some don't.
            </li>
            <li>
              <strong className="text-foreground">Japanese steels (VG-10, SG2, blue and white paper)</strong> — harder, sharper, lighter. The blades feel different in the hand and reward careful technique. More fragile than European steel — chip easier if abused.
            </li>
            <li>
              <strong className="text-foreground">Ceramic</strong> — light and very sharp out of the box, but brittle. They chip easily and can't be sharpened at home. Best avoided for serious cooking.
            </li>
          </ul>
        </div>

        {/* German vs Japanese */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="german-vs-japanese" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            German vs Japanese — understanding the difference
          </h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            This is the choice that divides cooks more than any other.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">German knives</strong> — typically heavier, with a curved blade designed for a rocking chopping motion. The steel is softer, which means the edge is slightly less sharp but more forgiving — easier to maintain and more resistant to chipping. Good for everyday heavy use. Brands like Wüsthof and Zwilling are the benchmark.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Japanese knives</strong> — lighter, thinner, with harder steel that takes a sharper edge and holds it longer. The trade-off is brittleness — Japanese knives chip more easily if used carelessly or on hard bones. They reward careful technique and proper maintenance. Brands like Global, Shun and MAC are well regarded.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Neither is better. They suit different styles of cooking and different styles of cook. If you chop hard vegetables and bones regularly, a German knife is more practical. If you do precise, careful work with fish and vegetables, a Japanese knife is a joy.
          </p>
        </div>

        {/* British knives */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="british-knives" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            British knives — a proud heritage
          </h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Before German and Japanese knives dominated the conversation, Britain — and Sheffield in particular — was the knife-making capital of the world. At its peak in the nineteenth century, Sheffield produced more cutlery than anywhere else on earth, supplying kitchens and tables across the British Empire. The city's combination of fast-flowing rivers for powering grinding wheels, local iron ore and skilled craftsmen made it uniquely suited to the trade.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            That heritage hasn't disappeared. Sheffield still makes knives, and several British brands are worth knowing about:
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            <li>
              <strong className="text-foreground">Robert Welch</strong> — based in Chipping Campden, Gloucestershire, Robert Welch combines strong design credentials with serious kitchen performance. Their knives are beautifully balanced, well finished and competitively priced against German equivalents. A genuinely excellent choice for home cooks who want quality without paying Japanese premium prices.
            </li>
            <li>
              <strong className="text-foreground">Richardson Sheffield</strong> — one of the oldest Sheffield makers still in operation, Richardson Sheffield produces solid, reliable knives at accessible prices. Widely available in UK supermarkets and kitchen shops, they represent good everyday value and carry the weight of genuine Sheffield heritage.
            </li>
            <li>
              <strong className="text-foreground">Stellar</strong> — a British brand producing well-regarded knives at mid-range prices. Popular with home cooks and a solid choice if you want quality without committing to a premium spend.
            </li>
            <li>
              <strong className="text-foreground">Joseph Joseph</strong> — London-based and more design-led than the Sheffield makers, Joseph Joseph has built a serious reputation for well-made, thoughtfully designed kitchen tools including knives. Not traditional in the Sheffield sense but genuinely good and widely trusted.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            <strong className="text-foreground">A note on Sheffield steel</strong> — at its finest, Sheffield steel was considered the best in the world. Joseph Rodgers &amp; Sons, founded in Sheffield in 1682 and holder of a Royal Warrant, was once the most celebrated knife maker on the planet. The brand still exists today. That history is worth something — and the craft, though diminished from its Victorian peak, has not been entirely lost. For a home cook who wants to support British manufacturing without compromising on quality, Robert Welch in particular stands comparison with the best German knives at a similar price point.
          </p>
        </div>

        {/* What to look for when buying */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="what-to-look-for-when-buying" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            What to look for when buying
          </h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Steel quality</strong> — high-carbon stainless steel is the sweet spot for most home cooks. It takes a good edge, resists rust and is relatively easy to maintain. Pure carbon steel takes an even better edge but requires more care — it will rust if not dried immediately.
            </li>
            <li>
              <strong className="text-foreground">Balance</strong> — hold the knife at the bolster with your thumb and index finger either side of the blade. A well-balanced knife should feel neither blade-heavy nor handle-heavy.
            </li>
            <li>
              <strong className="text-foreground">Handle comfort</strong> — grip the handle as you would when cooking. It should feel secure and comfortable. Try both wet and dry if possible.
            </li>
            <li>
              <strong className="text-foreground">Full tang</strong> — look for a knife where the metal runs the full length of the handle, visible as a strip between the handle scales. This indicates better construction and durability.
            </li>
            <li>
              <strong className="text-foreground">Weight</strong> — heavier is not always better. The right weight is the one that feels natural after an hour of prep.
            </li>
          </ul>
        </div>

        {/* How to hold a knife */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="how-to-hold-a-knife" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            How to hold a knife
          </h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The single technique that makes the biggest difference is the pinch grip. Pinch the blade between your thumb and the side of your index finger, just in front of the handle. Wrap your remaining fingers around the handle. This puts your hand in control of the blade, not the handle, and gives you precision and stability.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            With your other hand — the guide hand — curl your fingertips inwards into a claw, and let the flat side of the knife rest against your knuckles. Your knuckles guide the blade, and your fingertips stay safely tucked away. Move your guide hand back as you cut.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Let the knife do the work. A good knife slices on its own weight; you guide it. If you're pressing hard, the knife is blunt or you're using the wrong tool.
          </p>
        </div>

        {/* Keeping your knives sharp */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="keeping-your-knives-sharp" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            Keeping your knives sharp
          </h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            A sharp knife is safer than a blunt one. A blunt knife requires more force, slips more easily and produces less precise cuts. Sharpness is not a luxury — it is a basic requirement.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Honing steel</strong> — not a sharpener. A honing steel realigns the edge of the blade without removing metal. Use it regularly — before or after each session — to keep the edge true between sharpenings. Hold the steel vertically, tip on a chopping board, and draw the blade down at a consistent 15 to 20 degree angle.
            </li>
            <li>
              <strong className="text-foreground">Whetstones</strong> — the best way to sharpen a knife. A whetstone removes metal to create a new edge. Start with a coarser grit to repair a damaged or very blunt edge, finish with a finer grit to refine it. Takes practice but produces the best results.
            </li>
            <li>
              <strong className="text-foreground">Pull-through sharpeners</strong> — quick and easy but remove more metal than necessary and produce a less refined edge. Fine for a basic maintenance tool but not a replacement for a whetstone.
            </li>
            <li>
              <strong className="text-foreground">Electric sharpeners</strong> — convenient but aggressive. Use sparingly.
            </li>
            <li>
              <strong className="text-foreground">Professional sharpening</strong> — worth doing once or twice a year even if you maintain your knives well at home. A professional will restore an edge that home sharpening cannot.
            </li>
          </ul>
        </div>

        {/* Storing your knives */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="storing-your-knives" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            Storing your knives
          </h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Magnetic strip</strong> — the best option. Keeps knives accessible, visible and undamaged. Blades don't touch each other and the edge is preserved.
            </li>
            <li>
              <strong className="text-foreground">Knife block</strong> — fine if the slots are wide enough. Narrow slots can damage the edge as you slide the knife in and out.
            </li>
            <li>
              <strong className="text-foreground">Blade guards</strong> — useful for individual knives stored in a drawer. Never store unprotected knives loose in a drawer — it damages the edge and is a safety risk.
            </li>
            <li>
              <strong className="text-foreground">Avoid the dishwasher</strong> — heat, harsh detergent and rattling against other items will damage both the blade and the handle. Always hand wash and dry immediately.
            </li>
          </ul>
        </div>

        {/* Common mistakes to avoid */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="common-mistakes-to-avoid" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            Common mistakes to avoid
          </h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Putting knives in the dishwasher</strong> — the heat, the chemicals and the knocking against other items dull the edge and damage the handle. Wash by hand, dry immediately.
            </li>
            <li>
              <strong className="text-foreground">Using a glass or stone board</strong> — they destroy edges. Cut on wood or a soft plastic board; both are kinder to the blade and to your wrists.
            </li>
            <li>
              <strong className="text-foreground">Leaving knives loose in a drawer</strong> — bad for the blade and dangerous for you. Store on a magnetic strip, in a block, or in a sheath.
            </li>
            <li>
              <strong className="text-foreground">Using the wrong knife for the job</strong> — a chef's knife is not a bone cleaver and a paring knife is not a bread knife. Use the right tool and it will last.
            </li>
            <li>
              <strong className="text-foreground">Letting them go blunt</strong> — a blunt knife is more dangerous than a sharp one because you have to push harder, and it slips. Hone often, sharpen regularly.
            </li>
          </ul>
        </div>

        {/* The one knife rule */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="the-one-knife-rule" className="font-display text-3xl md:text-4xl text-foreground mb-6 scroll-mt-24">
            The one knife rule
          </h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            If you could only own one knife, make it a 20cm chef's knife in high-carbon stainless steel, kept sharp. It will do almost everything. A paring knife and a bread knife can follow when budget allows. Everything else is a speciality tool for specific tasks — useful when you need them, unnecessary when you don't.
          </p>
        </div>

        <GuideRelatedRecipes guideSlug="kitchen-knives" />

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

export default GuideKitchenKnives;
