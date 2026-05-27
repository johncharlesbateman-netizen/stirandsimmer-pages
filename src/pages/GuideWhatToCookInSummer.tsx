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
import heroImage from "@/assets/guide-what-to-cook-in-summer-hero.webp";
import heroImageSrcSet from "@/assets/guide-what-to-cook-in-summer-hero.webp?w=640;960;1280;1600&format=webp&as=srcset";

const GuideWhatToCookInSummer = () => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_ORIGIN}/guides` },
      {
        "@type": "ListItem",
        position: 3,
        name: "What to cook in summer",
        item: `${SITE_ORIGIN}/guides/what-to-cook-in-summer`,
      },
    ],
  };

  return (
    <Layout>
      <GuideSeo slug="what-to-cook-in-summer" />
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
            alt="A sunlit summer table with grilled vegetables, ripe tomatoes, peaches, fresh herbs and a jug of iced drink"
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
                { label: "What to cook in summer" },
              ]}
            />
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Guides
            </Link>
            <p className="micro-caption mb-4 text-primary">Seasonal</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-foreground mb-5">
              What to cook in summer — a seasonal guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              The easiest cooking of the year, if you let the ingredients do the work. A ripe tomato in August needs almost nothing from you to be the best thing on the table.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Summer cooking in Britain is a short and glorious window. The produce is at its peak, the days are long, the oven can mostly stay off, and the most satisfying meals often involve nothing more complicated than a sharp knife and a good bottle of olive oil. This guide is a map for the season — what to buy, what to make, and how to do less and end up with more.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
            { id: "why-seasonal", label: "Why cooking seasonally matters" },
            { id: "whats-in-season", label: "What's in season in summer in the UK" },
            { id: "summer-salads", label: "Summer salads — building something worth eating" },
            { id: "grilling-barbecue", label: "Grilling and barbecue — the basics done properly" },
            { id: "cold-make-ahead", label: "Cold dishes and make-ahead food for hot days" },
            { id: "summer-herbs", label: "Summer herbs — how to use them at their best" },
            { id: "soft-fruits", label: "Soft fruits and berries — beyond jam" },
            { id: "summer-drinks", label: "Summer drinks and what to cook alongside them" },
            { id: "five-dishes", label: "Five summer dishes every cook should know" },
          ]}
        />

        {/* Why cooking seasonally matters */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="why-seasonal" className="font-display text-3xl md:text-4xl text-foreground mb-6">Why cooking seasonally matters</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The supermarket has spent the last thirty years convincing us that everything is in season all the time. Strawberries in January, tomatoes in March, asparagus in November. It's a clever trick, but the produce that arrives out of season has been picked under-ripe and shipped halfway around the world. It looks the part. It rarely tastes of much.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            A British strawberry in late June, eaten the day it was picked, is almost a different fruit from the pale Spanish berry that sits in the fridge in February. The same is true of tomatoes, peas, sweetcorn, courgettes, peaches, plums and almost everything else. Seasonal food is cheaper, tastes better, travels less, supports local growers — and asks less of you in the kitchen. A perfectly ripe tomato needs salt and oil, not a recipe.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Cook with the season and your cooking gets simpler and better at the same time. That's the whole argument.
          </p>
        </div>

        {/* What's in season */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="whats-in-season" className="font-display text-3xl md:text-4xl text-foreground mb-6">What's in season in summer in the UK</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            British summer runs roughly from June to early September, with a long shoulder of late spring at the start and early autumn at the end. The peak is July and August. Here's what to look out for, roughly in the order it arrives.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <li>
              <strong className="text-foreground">June</strong> — strawberries, broad beans, peas, new potatoes, asparagus (just finishing), elderflowers, gooseberries, lettuce, radishes, spring onions, mackerel, sea trout, crab.
            </li>
            <li>
              <strong className="text-foreground">July</strong> — courgettes, cherries, raspberries, blackcurrants, redcurrants, runner beans, French beans, the first tomatoes, cucumbers, fennel, lamb, sardines.
            </li>
            <li>
              <strong className="text-foreground">August</strong> — tomatoes at their peak, sweetcorn, aubergines, peppers, plums, peaches and nectarines (mostly imported but at their best now), figs, blackberries, basil, samphire.
            </li>
            <li>
              <strong className="text-foreground">Early September</strong> — late tomatoes, sweetcorn still going, the first apples and pears, damsons, blackberries, the first wild mushrooms, partridge.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Farmers' markets, a good greengrocer or a local box scheme will tell you more about the season in a single visit than any list. If a stall has piles of something, that's what's in.
          </p>
        </div>

        {/* Summer salads */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="summer-salads" className="font-display text-3xl md:text-4xl text-foreground mb-6">Summer salads — building something worth eating</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            A salad is not a sad pile of leaves on the side of the plate. A proper summer salad is the main event — built with intention, dressed with care, and substantial enough to be lunch.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The trick is to think in layers rather than ingredients. A good salad usually has four or five components doing different jobs: something soft (ripe tomato, peach, mozzarella, avocado), something crunchy (cucumber, radish, fennel, toasted nuts, croutons), something punchy (capers, olives, anchovy, chilli, shallot), something fresh (basil, mint, parsley, dill) and a dressing that brings it all together. Leaves are optional, not the foundation.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Dressing matters more than anything else.</strong> Three parts good olive oil to one part acid (lemon juice, sherry vinegar, red wine vinegar) — whisked with a tiny grating of garlic, a teaspoon of mustard, salt and a generous grind of pepper. Taste, adjust, taste again. Dress at the last minute or the leaves go limp.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            And season everything. A salad without enough salt is the most common reason a summer plate tastes flat. Tomatoes in particular need a heavier hand than you'd think — salt them ten minutes before you dress them, and they release their juices into the bowl.
          </p>
        </div>

        {/* Grilling and barbecue */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="grilling-barbecue" className="font-display text-3xl md:text-4xl text-foreground mb-6">Grilling and barbecue — the basics done properly</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Most home barbecues are sabotaged at the start. A few habits sort it out.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <li>
              <strong className="text-foreground">Get the coals properly hot.</strong> Light the barbecue at least 30–40 minutes before you cook, and wait until the coals are covered in fine grey ash with no flames. Cooking over flames burns the outside before the inside has a chance.
            </li>
            <li>
              <strong className="text-foreground">Build two zones.</strong> Push the coals to one side so you have a hot direct side for searing and a cooler indirect side for finishing. This lets you brown a thick cut hard and then move it across to cook through gently — the difference between charred-raw and properly cooked.
            </li>
            <li>
              <strong className="text-foreground">Season generously and oil the food, not the grill.</strong> Salt at least 20 minutes ahead for steaks and chops; a light brush of oil on the meat or vegetable, never the bars, stops sticking and helps colouring.
            </li>
            <li>
              <strong className="text-foreground">Stop poking it.</strong> Leave food alone long enough for proper grill marks to form. If it's stuck, it isn't ready to turn — give it another minute.
            </li>
            <li>
              <strong className="text-foreground">Rest meat before serving.</strong> Five minutes for a chop, ten for a steak, fifteen for a bigger joint. The juices settle back through the meat instead of running onto the board.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            And remember the vegetables. Courgette planks, halved peppers, whole spring onions, aubergine slices, sweetcorn, halved peaches — all sensational over coals. A drizzle of good olive oil, a squeeze of lemon and a tear of basil afterwards, and you have a side that deserves top billing.
          </p>
        </div>

        {/* Cold and make-ahead */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="cold-make-ahead" className="font-display text-3xl md:text-4xl text-foreground mb-6">Cold dishes and make-ahead food for hot days</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            On the hottest days, nobody wants to stand over a stove at six o'clock. Plan a meal that's mostly built earlier and assembled at the last minute.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Cold soups</strong> — gazpacho (blitzed raw tomatoes, cucumber, pepper, garlic, bread, olive oil, sherry vinegar), vichyssoise (leek and potato, served chilled), chilled cucumber and yoghurt soup. Made in the morning, served straight from the fridge.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Slow-cooked then chilled</strong> — a piece of poached salmon, a slow-roasted shoulder of lamb pulled into shreds, a whole roast chicken cooked the night before and served cold with mayonnaise and a salad. Cold meat and a sharp pickle is one of the great summer plates.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Grain salads</strong> — farro, freekeh, giant couscous or barley, cooked in salted water, dressed warm with olive oil and lemon so they soak it up, then tossed cold with herbs, roasted vegetables, feta, nuts or olives. Better the next day, properly portable, and they sit happily on the table for an hour without spoiling.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            <strong className="text-foreground">Things in a jar</strong> — pickles, salsa verde, whipped feta, a really good aioli, a quart of vinaigrette. Make them at the weekend; they earn their keep all week.
          </p>
        </div>

        {/* Summer herbs */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="summer-herbs" className="font-display text-3xl md:text-4xl text-foreground mb-6">Summer herbs — how to use them at their best</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Soft summer herbs — basil, mint, parsley, coriander, chives, dill, tarragon, chervil — are at their peak from June to September. Treat them as ingredients, not garnishes. A handful of basil torn over a salad isn't decoration; it's the difference between a tomato salad and <em>the</em> tomato salad.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            A few rules. Soft herbs go in at the end, off the heat — cooking turns them grey and dulls their flavour. Tear them rather than chop them, especially basil and mint, to keep the volatile oils where they should be. Don't be mean: a salad for four wants a proper handful, not a sprig.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Build a few herb sauces into your week and you'll use up everything in the fridge.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Salsa verde</strong> — parsley, mint, basil, capers, anchovy, garlic, mustard, red wine vinegar, olive oil. Chopped by hand, not blitzed. Spooned over grilled fish, lamb, chicken, eggs, almost anything.
            </li>
            <li>
              <strong className="text-foreground">Chimichurri</strong> — parsley, oregano, garlic, chilli, red wine vinegar, olive oil. Cuts through any grilled meat, especially steak.
            </li>
            <li>
              <strong className="text-foreground">Pesto</strong> — basil, pine nuts, parmesan, garlic, olive oil. Use it on pasta, sure, but also on roasted vegetables, drizzled over a tomato salad, or stirred into yoghurt as a dip.
            </li>
            <li>
              <strong className="text-foreground">Mint and yoghurt</strong> — torn mint, thick yoghurt, a squeeze of lemon, salt. Alongside lamb, chickpeas, roasted aubergine or just a flatbread.
            </li>
          </ul>
        </div>

        {/* Soft fruits and berries */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="soft-fruits" className="font-display text-3xl md:text-4xl text-foreground mb-6">Soft fruits and berries — beyond jam</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The British summer is a parade of soft fruit — strawberries, raspberries, gooseberries, currants, cherries, then later plums and blackberries. Jam is the obvious destination, but they're capable of much more than that.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <li>
              <strong className="text-foreground">Macerate them</strong> — a punnet of strawberries or raspberries, halved or torn, tossed with a tablespoon of sugar and a splash of something acidic (lemon, balsamic, sherry vinegar, even black pepper). Leave for an hour. The fruit releases its juice and becomes intensely flavoured. Spoon over yoghurt, ice cream, sponge cake or a piece of toast and ricotta.
            </li>
            <li>
              <strong className="text-foreground">Roast or grill them</strong> — peaches halved and grilled cut-side down, plums roasted with a little sugar and a splash of wine, apricots quickly charred and tossed with burrata. Heat concentrates the flavour and brings out caramel notes.
            </li>
            <li>
              <strong className="text-foreground">Put them in savoury dishes</strong> — sliced peach with prosciutto and basil, strawberries with mozzarella and balsamic, cherries with duck, gooseberries with mackerel. Sweet fruit and fat protein is one of the great summer combinations.
            </li>
            <li>
              <strong className="text-foreground">Freeze them while they're cheap</strong> — spread berries in a single layer on a tray, freeze hard, then bag them up. Excellent for crumbles, smoothies and ice cream all winter, and a small comfort in February.
            </li>
            <li>
              <strong className="text-foreground">Eton mess</strong> — broken meringue, whipped cream, crushed strawberries with their juice. A pudding that requires no skill and outshines almost everything more complicated.
            </li>
          </ul>
        </div>

        {/* Summer drinks */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="summer-drinks" className="font-display text-3xl md:text-4xl text-foreground mb-6">Summer drinks and what to cook alongside them</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Summer drinking is its own pleasure, and the food that goes with it is usually the simplest, best food of the year.
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <li>
              <strong className="text-foreground">A crisp white or rosé</strong> — picpoul, muscadet, vinho verde, a dry Provençal rosé. Built for shellfish, grilled fish, tomato salads, herby chicken, anything from the lighter end of summer cooking.
            </li>
            <li>
              <strong className="text-foreground">An Aperol spritz or a Negroni sbagliato</strong> — bitter, fizzy, low in alcohol, almost compulsory. Serve with olives, crisps, a bowl of almonds, a wedge of focaccia.
            </li>
            <li>
              <strong className="text-foreground">A jug of Pimm's</strong> — long, fruity, gently boozy. Goes with anything off a barbecue and disappears alarmingly fast.
            </li>
            <li>
              <strong className="text-foreground">A cold beer</strong> — still the best partner for spicy, smoky or fried food. Burgers, fried chicken, anything heavily seasoned.
            </li>
            <li>
              <strong className="text-foreground">Homemade lemonade or iced tea</strong> — a jug of one or both in the fridge transforms a hot afternoon. Lemon, sugar, water, lots of ice; or strong tea brewed and chilled with mint and a slice of lemon.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            The best summer entertaining is loose — a few jugs, a big board of things to pick at, and a main course that mostly looks after itself.
          </p>
        </div>

        {/* Five dishes */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2 id="five-dishes" className="font-display text-3xl md:text-4xl text-foreground mb-6">Five summer dishes every cook should know</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            Learn these five and you have most of the season covered.
          </p>
          <ul className="space-y-5 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">A proper tomato salad</strong> — the best ripe tomatoes you can find, in mixed colours and sizes, sliced thick. Salted ten minutes ahead. A finely sliced shallot soaked briefly in vinegar to soften it. Torn basil, a generous slick of the best olive oil you own, flaky salt, black pepper. That's it. Don't add mozzarella every time — sometimes the tomato deserves to stand alone.
            </li>
            <li>
              <strong className="text-foreground">A whole roasted or barbecued fish</strong> — sea bass, sea bream or mackerel, stuffed with lemon slices, parsley and a few garlic cloves. Twenty minutes in a hot oven or fifteen on the grill, turned once. Served with salsa verde, lemon wedges and bread to mop the juices.
            </li>
            <li>
              <strong className="text-foreground">A summer pasta</strong> — spaghetti with raw tomato sauce, a handful of torn basil, garlic warmed gently in olive oil, finished with a slick of the best oil you have. Twenty minutes start to finish. The tomato is barely cooked, the dish tastes of the season.
            </li>
            <li>
              <strong className="text-foreground">Marinated grilled lamb</strong> — lamb leg steaks or butterflied leg, marinated for a few hours in olive oil, garlic, lemon zest, rosemary and a pinch of chilli. Grilled hard, rested properly, sliced across the grain. Served with flatbreads, yoghurt and mint, and a chopped salad.
            </li>
            <li>
              <strong className="text-foreground">A proper Eton mess</strong> — or its cousins: strawberries and cream, peaches and ice cream, raspberries and whipped mascarpone. A reminder that the best pudding of the year is the one that uses what's ripe and adds almost nothing.
            </li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mt-6">
            Master these five and the rest of summer cooking is improvisation. Buy what looks best, salt it well, dress it with care, eat it outside.
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
                <p className="text-base text-muted-foreground mt-1">A bowl of spaghetti with raw tomato sauce is the dish of August. Here's how to get the pasta itself right.</p>
              </Link>
            </li>
            <li>
              <Link to="/guides/understanding-olive-oil" className="group block">
                <p className="micro-caption text-primary mb-1">Kitchen Essentials</p>
                <p className="font-display text-xl text-foreground group-hover:underline">Understanding olive oil — a cook's guide</p>
                <p className="text-base text-muted-foreground mt-1">Summer cooking lives or dies by the bottle of oil you reach for. What to buy and when to use it.</p>
              </Link>
            </li>
          </ul>
        </section>

        <GuideRelatedRecipes guideSlug="what-to-cook-in-summer" heading="Recipes to cook this summer" />

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
              Hungry for summer?
            </h2>
            <p className="text-base md:text-lg mb-8 text-warm-cream-muted">
              Head to The Kitchen Atlas and explore Mediterranean, Middle Eastern and British recipes that put the season on the table.
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

export default GuideWhatToCookInSummer;
