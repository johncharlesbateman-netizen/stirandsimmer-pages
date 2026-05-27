import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const GuideChoosingPans = () => {
  return (
    <Layout>
      <GuideSeo slug="choosing-pans" />

      <article className="bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "Choosing the right pan for the job" },
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
              Choosing the right pan for the job
            </h1>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
              The right pan makes cooking easier, more consistent and more enjoyable. The wrong one makes everything harder — food sticks, heat spreads unevenly, handles get too hot, nothing browns properly. Most home cooks accumulate pans over the years without ever really thinking about what each one is for.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
              This guide fixes that.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
              The pan you cook in matters more than most home cooks realise. The right pan does half the work for you — it conducts heat evenly, releases food cleanly and makes the difference between a steak with a deep, even crust and one that's grey and stewed.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              You don't need a cupboard full of cookware. You need three or four good pans that earn their keep. This is a guide to the materials, the shapes, and how to choose the ones that will quietly improve everything you cook.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
              { id: "why-the-pan-matters", label: "Why the pan matters" },
              
              { id: "the-materials", label: "The materials" },
              { id: "the-main-types-of-pan", label: "The main types of pan" },
              { id: "essential-pans-for-a-home-kitchen", label: "Essential pans for a home kitchen" },
              { id: "what-to-look-for-when-buying", label: "What to look for when buying" },
              { id: "cooking-on-induction-what-you-need-to-know", label: "Cooking on induction — what you need to know" },
              { id: "common-mistakes-to-avoid", label: "Common mistakes to avoid" },
              { id: "caring-for-your-pans", label: "Caring for your pans" },
              { id: "the-one-pan-rule", label: "The one pan rule" },
          ]}
        />

        {/* Why the pan matters */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="why-the-pan-matters" className="font-display text-3xl md:text-4xl text-foreground mb-6">Why the pan matters</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            A pan is a heat exchanger. Its job is to take energy from your hob and deliver it to the food, evenly and at the right rate. A thin, lightweight pan will hotspot, scorch and lose temperature the second food hits it. A heavy, well-made pan will hold its heat, sear properly and forgive small mistakes.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            The shape matters too. Sloped sides for tossing and reducing. Straight sides for braising and shallow frying. Wide and flat for searing. The right shape makes a technique easier; the wrong shape makes it nearly impossible.
          </p>
        </div>

        {/* The materials */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-materials" className="font-display text-3xl md:text-4xl text-foreground mb-6">The materials</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Stainless steel</strong> — the workhorse. Durable, oven-safe, non-reactive and brilliant for building fond — the caramelised bits that make pan sauces sing. Look for a heavy tri-ply or five-ply pan with an aluminium core. Avoid thin, single-layer steel.
            </li>
            <li>
              <strong className="text-foreground">Cast iron</strong> — unbeatable for searing. Holds heat like nothing else, gives meat a proper crust, and only gets better with age. Heavy, slow to heat up, and needs seasoning rather than scrubbing. A 26cm or 30cm skillet is the one to own.
            </li>
            <li>
              <strong className="text-foreground">Carbon steel</strong> — the chef's secret. Sears almost as well as cast iron but lighter and more responsive. Brilliant for vegetables, eggs once seasoned, and anything that needs quick high heat. The pan most restaurant kitchens actually reach for.
            </li>
            <li>
              <strong className="text-foreground">Non-stick</strong> — for one job: eggs and delicate fish. Don't use it for searing, don't put it in a hot oven, and replace it when it starts to wear. A cheap non-stick pan replaced every couple of years will serve you better than an expensive one you try to make last forever.
            </li>
            <li>
              <strong className="text-foreground">Enamelled cast iron</strong> — slow cooking, braising, stews. A good casserole — a Dutch oven — will go from hob to oven to table and last decades. Worth the investment.
            </li>
            <li>
              <strong className="text-foreground">Copper</strong> — beautiful, responsive, expensive. Reacts to heat changes faster than anything else, which makes it the gold standard for sauces and sugar work. Niche, but lovely if you have the budget.
            </li>
          </ul>
        </div>

        {/* The main types of pan */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-main-types-of-pan" className="font-display text-3xl md:text-4xl text-foreground mb-6">The main types of pan</h2>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Stainless steel
          </h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The workhorse of the professional kitchen. Stainless steel is durable, non-reactive, oven-safe and dishwasher-safe. It conducts heat reasonably well, especially when paired with an aluminium or copper core, and it develops fond — those caramelised bits that stick to the pan and become the foundation of a great sauce.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The catch: stainless steel will stick if used incorrectly. The key is to preheat the pan properly and add your fat before the food. When the pan is hot enough, protein will release naturally rather than tearing.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-10">
            <strong className="text-foreground">Best for:</strong> searing meat, making pan sauces, sautéing vegetables, general everyday cooking.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Cast iron
          </h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Heavy, slow to heat but extraordinary at retaining it. Cast iron heats unevenly at first but once up to temperature it holds that heat with remarkable consistency — making it ideal for searing, frying and anything that needs sustained, even heat.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            It also goes from hob to oven seamlessly, which makes it useful for dishes that start on the stove and finish in the oven. A cast iron pan, properly cared for, will outlast everything else in your kitchen.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The catch: it's heavy, it reacts with acidic foods if unseasoned, and it needs proper maintenance — drying thoroughly and oiling after every wash.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-10">
            <strong className="text-foreground">Best for:</strong> searing steaks, frying, cornbread, dishes that go from hob to oven, cooking over open fire.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Non-stick
          </h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The most forgiving pan in the kitchen. Non-stick surfaces — typically PTFE-based coatings or ceramic — prevent food from adhering, making them ideal for delicate ingredients that would otherwise tear or stick.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The catch: non-stick coatings degrade over time, especially if overheated or scratched with metal utensils. They should never be used on very high heat and should be replaced when the coating begins to show wear.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-10">
            <strong className="text-foreground">Best for:</strong> eggs, fish fillets, pancakes, anything delicate that needs a gentle release.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Carbon steel
          </h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The professional kitchen's best kept secret. Lighter than cast iron but with many of the same properties — it heats quickly, retains heat well, develops a natural non-stick seasoning over time, and goes from hob to oven without complaint.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Carbon steel is the pan of choice in most restaurant kitchens for a reason. It requires seasoning like cast iron but responds faster to changes in heat, giving you more control.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-10">
            <strong className="text-foreground">Best for:</strong> searing, sautéing, eggs once seasoned, anything you'd use cast iron or stainless steel for.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Copper
          </h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The most responsive of all pan materials. Copper heats and cools almost instantly, giving unparalleled control — which is why it's the choice of serious pastry chefs for temperature-sensitive work like sugar and chocolate.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The catch: copper is expensive, requires regular polishing, and reacts with acidic foods unless lined with tin or stainless steel.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            <strong className="text-foreground">Best for:</strong> sauces, sugar work, chocolate, anything requiring precise temperature control.
          </p>
        </div>

        {/* The pans worth owning */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="essential-pans-for-a-home-kitchen" className="font-display text-3xl md:text-4xl text-foreground mb-6">Essential pans for a home kitchen</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            You don't need every type. A well-chosen selection of three or four pans will cover almost everything:
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">A large stainless steel frying pan or sauté pan</strong> — your everyday workhorse. Buy the best you can afford with a thick, multi-ply base. A 28cm pan covers most tasks.
            </li>
            <li>
              <strong className="text-foreground">A cast iron skillet</strong> — for searing, frying and hob-to-oven cooking. A 26cm skillet is the most versatile size.
            </li>
            <li>
              <strong className="text-foreground">A non-stick frying pan</strong> — for eggs, fish and delicate work. Keep it for these tasks only and don't overheat it.
            </li>
            <li>
              <strong className="text-foreground">A large stainless steel saucepan</strong> — for stocks, soups, sauces and pasta water. Choose one with a heavy base and a well-fitting lid.
            </li>
            <li>
              <strong className="text-foreground">A casserole dish or Dutch oven</strong> — ideally cast iron with an enamel coating. The foundation of braises, stews and slow cooking. Enamelled cast iron doesn't require seasoning and is easy to clean.
            </li>
          </ul>
        </div>

        {/* What to look for when buying */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="what-to-look-for-when-buying" className="font-display text-3xl md:text-4xl text-foreground mb-6">What to look for when buying</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Base thickness</strong> — a thick, heavy base distributes heat evenly and prevents hot spots. Cheap pans with thin bases warp and heat unevenly.
            </li>
            <li>
              <strong className="text-foreground">Handle comfort and security</strong> — the handle should feel solid and balanced. Riveted handles are more secure than welded ones. Check whether it stays cool on the hob.
            </li>
            <li>
              <strong className="text-foreground">Oven-safe temperature</strong> — if you want to use a pan in the oven, check the maximum temperature. Many non-stick pans have low limits. Cast iron and stainless steel are usually unlimited.
            </li>
            <li>
              <strong className="text-foreground">Induction compatibility</strong> — if you cook on induction, check the pan has a magnetic base. Cast iron, carbon steel and most stainless steel work on induction. Copper and aluminium typically don't.
            </li>
          </ul>
        </div>

        {/* Cooking on induction */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="cooking-on-induction-what-you-need-to-know" className="font-display text-3xl md:text-4xl text-foreground mb-6">Cooking on induction — what you need to know</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Induction hobs work differently from gas and electric. Rather than generating heat and transferring it to the pan, induction uses electromagnetic energy to heat the pan directly. This makes induction faster, more responsive and more energy efficient than any other hob type — but it also means not every pan will work on it.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
            For a pan to work on induction it must contain ferromagnetic material — in simple terms, it needs to be magnetic. The easiest test: hold a fridge magnet to the base of the pan. If it sticks, the pan will work on induction.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Works on induction
          </h3>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
            <li>
              <strong className="text-foreground">Cast iron</strong> — excellent on induction, heats evenly and retains heat beautifully.
            </li>
            <li>
              <strong className="text-foreground">Carbon steel</strong> — works well and responds quickly to heat changes.
            </li>
            <li>
              <strong className="text-foreground">Stainless steel</strong> — works if it has a magnetic base, which most quality stainless steel does.
            </li>
            <li>
              <strong className="text-foreground">Enamelled cast iron</strong> — works on induction regardless of colour or coating.
            </li>
          </ul>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Does not work on induction
          </h3>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
            <li>
              <strong className="text-foreground">Pure aluminium</strong> — not magnetic, will not work unless it has a magnetic base added.
            </li>
            <li>
              <strong className="text-foreground">Copper</strong> — not magnetic, will not work unless specifically designed for induction.
            </li>
            <li>
              <strong className="text-foreground">Some non-stick pans</strong> — check the base; many are aluminium with a non-stick coating and will not work.
            </li>
          </ul>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            What to look for when buying for induction
          </h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Look for the induction symbol on the packaging — it looks like a coil of wire. Any pan labelled induction-compatible has been tested and confirmed to work. If you're replacing an existing pan collection for an induction hob, it's worth testing everything you already own with a magnet before assuming it needs replacing — you may find more of it works than you expect.
          </p>
        </div>

        {/* Common mistakes to avoid */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="common-mistakes-to-avoid" className="font-display text-3xl md:text-4xl text-foreground mb-6">Common mistakes to avoid</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Using non-stick for searing</strong> — non-stick coatings break down at high heat and never give you the crust or fond you need. Reach for stainless steel, cast iron or carbon steel instead.
            </li>
            <li>
              <strong className="text-foreground">Overcrowding the pan</strong> — too much food drops the temperature and the pan starts to steam rather than sear. Cook in batches if you have to. Give the food room.
            </li>
            <li>
              <strong className="text-foreground">Not preheating</strong> — most pans need a minute or two on the hob before food goes in. A pan that isn't properly hot will stick, weep and brown badly.
            </li>
            <li>
              <strong className="text-foreground">Washing cast iron with soap</strong> — it strips the seasoning. Hot water, a stiff brush, dry on the hob, a thin film of oil. That's it.
            </li>
            <li>
              <strong className="text-foreground">Buying a full set</strong> — most matching cookware sets include pans you'll never use. Build your collection one pan at a time and only add what you actually need.
            </li>
          </ul>
        </div>

        {/* Caring for your pans */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="caring-for-your-pans" className="font-display text-3xl md:text-4xl text-foreground mb-6">Caring for your pans</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Stainless steel</strong> — dishwasher safe but hand washing preserves the finish. For stubborn residue, deglaze with water while still hot or use a stainless steel cleaner.
            </li>
            <li>
              <strong className="text-foreground">Cast iron</strong> — never soak in water. Wash with warm water and a stiff brush, dry immediately and thoroughly, then apply a thin layer of oil before storing. Re-season in the oven periodically.
            </li>
            <li>
              <strong className="text-foreground">Non-stick</strong> — hand wash only with a soft cloth. Never use metal utensils. Replace when the coating shows wear.
            </li>
            <li>
              <strong className="text-foreground">Carbon steel</strong> — treat like cast iron. Keep it dry, keep it oiled, and it will reward you for years.
            </li>
            <li>
              <strong className="text-foreground">Copper</strong> — hand wash only. Polish regularly to maintain appearance and performance.
            </li>
          </ul>
        </div>

        {/* The one pan rule */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-one-pan-rule" className="font-display text-3xl md:text-4xl text-foreground mb-6">The one pan rule</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            If you could only own one pan, make it a 28cm stainless steel frying pan with a thick base. It won't be perfect for everything — eggs will stick until you learn the technique, and it won't hold heat like cast iron — but it will handle more tasks more capably than any other single pan. Everything else builds from there.
          </p>
        </div>

        <GuideRelatedRecipes guideSlug="choosing-pans" />

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

export default GuideChoosingPans;
