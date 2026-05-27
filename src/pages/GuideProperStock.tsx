import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const GuideProperStock = () => {
  return (
    <Layout>
      <GuideSeo slug="proper-stock" />

      <article className="bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "How to make a proper stock" },
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
              How to make a proper stock
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              The quiet foundation of good cooking — what goes in, how long it takes, and why a homemade stock will outperform anything in a carton.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Stock is one of those things that separates cooking that tastes good from cooking that tastes remarkable. It's not complicated. It doesn't require special skills or expensive ingredients. What it requires is time — and the understanding that the best things in a kitchen are often the simplest.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
              { id: "what-stock-actually-is", label: "What stock actually is" },
              { id: "why-stock-matters", label: "Why stock matters" },
              { id: "why-bother-making-your-own", label: "Why bother making your own" },
              { id: "stock-vs-broth", label: "Stock vs broth" },
              { id: "the-four-main-stocks", label: "The four main stocks" },
              { id: "the-basic-method-chicken-stock", label: "The basic method — chicken stock" },
              { id: "how-to-know-it-s-good", label: "How to know it's good" },
              { id: "the-four-things-you-need", label: "The four things you need" },
              { id: "white-vs-brown-stock", label: "White vs brown stock" },
              { id: "step-by-step", label: "Step by step" },
              { id: "common-mistakes-to-avoid", label: "Common mistakes to avoid" },
              { id: "storing-and-using-your-stock", label: "Storing and using your stock" },
              { id: "a-note-on-pressure-cookers", label: "A note on pressure cookers" },
          ]}
        />

        {/* What stock actually is */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="what-stock-actually-is" className="font-display text-3xl md:text-4xl text-foreground mb-6">What stock actually is</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Stock is water that has been taught to taste of something. You simmer bones, vegetables and aromatics together long enough for everything they contain — collagen, minerals, natural sugars, flavour compounds — to dissolve into the liquid. What you're left with is a deeply flavoured base that makes everything you cook with it better.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            It is not the same as a cube. A stock cube is salt with flavouring. It has its place, but it is not stock.
          </p>
        </div>

        {/* Why stock matters */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="why-stock-matters" className="font-display text-3xl md:text-4xl text-foreground mb-6">Why stock matters</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Stock adds body, savouriness and depth that water simply can't. The collagen from the bones gives sauces their silky weight. The slow extraction of vegetables and aromatics gives a backdrop of flavour that you can taste in the finished dish even when you can't quite name it. Shop-bought stock is mostly salt and flavouring — useful in a pinch, but never the same.
          </p>
        </div>

        {/* Why bother making your own */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="why-bother-making-your-own" className="font-display text-3xl md:text-4xl text-foreground mb-6">Why bother making your own</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Shop-bought stock has improved considerably. There are some decent fresh stocks available in supermarkets now. But homemade stock has qualities that no carton can replicate.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            When you make stock from bones, particularly roasted ones, you extract collagen that converts to gelatin as it cooks. A good stock, when chilled, should set to a loose jelly. That gelatin is what gives a sauce or a braise its body — that quality of coating your mouth rather than just washing over it.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Homemade stock is also almost free. You are using things that would otherwise be thrown away.
          </p>
        </div>

        {/* Stock vs broth */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="stock-vs-broth" className="font-display text-3xl md:text-4xl text-foreground mb-6">Stock vs broth</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The two words get used interchangeably, but there's a useful distinction.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">Stock</strong> is made primarily from bones. It's unseasoned, simmered for hours, and prized for its body — the gelatine from the bones is what makes a good stock set to a wobble in the fridge.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            <strong className="text-foreground">Broth</strong> is made from meat (often with bones), seasoned, and meant to be sipped or eaten on its own. It's lighter, quicker, and tastes finished rather than foundational.
          </p>
        </div>

        {/* The four main stocks */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-four-main-stocks" className="font-display text-3xl md:text-4xl text-foreground mb-6">The four main stocks</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Chicken stock</strong> — the most versatile and the best place to start. Works in soups, risottos, sauces, braises, pasta dishes and more. Made from a chicken carcass, preferably roasted, with vegetables and aromatics.
            </li>
            <li>
              <strong className="text-foreground">Beef stock</strong> — richer and more robust. Made from roasted beef bones, ideally with some marrow. Takes longer than chicken but rewards the patience. Essential for proper gravies, French onion soup and red wine braises.
            </li>
            <li>
              <strong className="text-foreground">Vegetable stock</strong> — quicker than either of the above and a useful all-rounder. Made from vegetable trimmings, aromatics and herbs. Best used fresh as it doesn't keep as well.
            </li>
            <li>
              <strong className="text-foreground">Fish stock</strong> — the fastest of all, ready in under thirty minutes. Made from fish bones and heads. Delicate and quick to over-cook — don't be tempted to simmer it longer than the recipe says or it turns bitter.
            </li>
          </ul>
        </div>

        {/* The basic method — chicken stock */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-basic-method-chicken-stock" className="font-display text-3xl md:text-4xl text-foreground mb-6">The basic method — chicken stock</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
            This is the one to learn first. Once you understand it, the others follow naturally.
          </p>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            What you need
          </h3>
          <ul className="space-y-2 text-base md:text-lg text-foreground/90 leading-relaxed mb-8 list-disc pl-6">
            <li>1 chicken carcass, ideally roasted</li>
            <li>2 carrots, roughly chopped</li>
            <li>2 celery sticks, roughly chopped</li>
            <li>1 onion, halved</li>
            <li>1 leek, roughly chopped</li>
            <li>1 bulb of garlic, halved across the middle</li>
            <li>A few sprigs of thyme</li>
            <li>2 bay leaves</li>
            <li>A small bunch of flat leaf parsley stalks</li>
            <li>10 black peppercorns</li>
            <li>Cold water to cover</li>
          </ul>

          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Method
          </h3>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Place the carcass and all the vegetables in a large pot. Cover with cold water — always start with cold water, never hot, as this helps produce a clearer stock. Bring slowly to a gentle simmer.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            As it heats you'll see a grey foam rise to the surface. Skim this off with a spoon or ladle — it's impurities from the bones and it will cloud your stock and dull the flavour if left.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Once skimmed, reduce to the lowest simmer you can manage. The surface should barely move — just an occasional lazy bubble. Cook for three to four hours.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Do not boil. A rolling boil forces fat and impurities back into the liquid and produces a cloudy, greasy stock.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Strain through a fine sieve into a clean container. Press the solids gently to extract the last of the liquid but don't force them through or the stock will cloud. Discard everything in the sieve — it has given everything it has. Leave to cool, then refrigerate. Once cold, any fat will solidify on the surface and can be lifted off cleanly.
          </p>
        </div>

        {/* How to know it's good */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="how-to-know-it-s-good" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to know it's good</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            A good chicken stock should be golden and clear, with a clean, rounded flavour. When cold it should thicken noticeably — ideally setting to a loose jelly. If it stays completely liquid when cold, it either needed more collagen (add some chicken wings next time) or more time.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Taste it. It should taste clean and savoury, not flat, not greasy, not salty. It shouldn't taste finished — it's a base, not a soup.
          </p>
        </div>

        {/* The basics */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-four-things-you-need" className="font-display text-3xl md:text-4xl text-foreground mb-6">The four things you need</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Bones</strong> — chicken carcasses, beef marrow and knuckle, or fish frames. Ask your butcher; they're often free or close to it. For vegetable stock, swap in a generous pile of trimmings and whole vegetables.
            </li>
            <li>
              <strong className="text-foreground">Mirepoix</strong> — the classic French base of roughly chopped onion, carrot and celery in a 2:1:1 ratio. No need to peel. Leeks and fennel are welcome additions.
            </li>
            <li>
              <strong className="text-foreground">Aromatics</strong> — a bay leaf, a few peppercorns, a sprig of thyme, parsley stalks. Garlic if you like. Keep it restrained — stock is a backdrop, not a feature.
            </li>
            <li>
              <strong className="text-foreground">Cold water</strong> — enough to cover the bones by a couple of inches. Always start cold; it draws more flavour out as the temperature climbs.
            </li>
          </ul>
        </div>

        {/* White vs brown */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="white-vs-brown-stock" className="font-display text-3xl md:text-4xl text-foreground mb-6">White vs brown stock</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Same ingredients, different approach.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            <strong className="text-foreground">White stock</strong> uses raw bones straight into the pot. It's pale, clean and delicate — ideal for light sauces, risottos and poached dishes where you don't want a heavy roasted note.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            <strong className="text-foreground">Brown stock</strong> starts by roasting the bones and vegetables in a hot oven until deeply coloured. The Maillard reaction adds a savoury, almost meaty depth that's the foundation of classic gravies, French sauces and rich braises.
          </p>
        </div>

        {/* Step by step */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="step-by-step" className="font-display text-3xl md:text-4xl text-foreground mb-6">Step by step</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">1. Prepare the bones.</strong> For brown stock, roast at 220°C for 40 to 50 minutes until deep mahogany. For white stock, blanch raw bones briefly in boiling water then drain — this removes scum and gives a cleaner result.
            </li>
            <li>
              <strong className="text-foreground">2. Build the pot.</strong> Add the bones, mirepoix and aromatics to a tall, narrow pot. Cover with cold water by a couple of inches.
            </li>
            <li>
              <strong className="text-foreground">3. Bring up slowly.</strong> Heat gently to a bare simmer — never a rolling boil. A boil emulsifies the fat into the liquid and turns the stock cloudy and greasy.
            </li>
            <li>
              <strong className="text-foreground">4. Skim.</strong> For the first 20 minutes, skim the grey foam and fat that rises to the top. After that, leave it alone.
            </li>
            <li>
              <strong className="text-foreground">5. Simmer.</strong> Chicken stock: 3 to 4 hours. Beef or veal: 6 to 8 hours, longer if you can. Fish: 30 to 45 minutes only — any longer and it turns bitter. Vegetable: 45 minutes to an hour.
            </li>
            <li>
              <strong className="text-foreground">6. Strain.</strong> Pass through a fine sieve, ideally lined with muslin. Press gently — don't crush the solids or you'll cloud the liquid.
            </li>
            <li>
              <strong className="text-foreground">7. Cool quickly.</strong> Sit the pot in a sink of cold water and stir occasionally. Once cool, refrigerate. The fat will set on top and lift off cleanly the next day.
            </li>
          </ul>
        </div>

        {/* Common mistakes */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="common-mistakes-to-avoid" className="font-display text-3xl md:text-4xl text-foreground mb-6">Common mistakes to avoid</h2>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li><strong className="text-foreground">Boiling instead of simmering</strong> — the single most common error. Stock needs patience and a gentle heat.</li>
            <li><strong className="text-foreground">Not skimming</strong> — those grey impurities matter. Take five minutes at the start to skim properly and your stock will be cleaner and clearer.</li>
            <li><strong className="text-foreground">Adding salt</strong> — don't season your stock. Season the dish you're making with it. Stock reduces during cooking and salt concentrates — you can easily end up with something unpleasantly salty.</li>
            <li><strong className="text-foreground">Wasting vegetable trimmings</strong> — carrot peelings, celery leaves, onion skins, leek tops, parsley stalks. Keep a bag in the freezer and add them when you make stock. It costs you nothing.</li>
            <li><strong className="text-foreground">Using the wrong vegetables</strong> — avoid starchy vegetables like potato, which cloud the stock, and brassicas like broccoli or cabbage, which make it bitter. Stick to the classics.</li>
          </ul>
        </div>

        {/* How to use and store */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="storing-and-using-your-stock" className="font-display text-3xl md:text-4xl text-foreground mb-6">Storing and using your stock</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Stock keeps in the fridge for up to five days. It freezes beautifully for up to three months — freeze in usable portions, either in containers or in ice cube trays for small quantities.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Use it anywhere water or a cube would otherwise go. Risotto. Soups. Braises. Gravies. Deglazing a pan after searing meat. Cooking lentils. The more you make it, the more you'll find yourself reaching for it.
          </p>
        </div>

        {/* A note on pressure cookers */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="a-note-on-pressure-cookers" className="font-display text-3xl md:text-4xl text-foreground mb-6">A note on pressure cookers</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            If you have a pressure cooker or an Instant Pot, chicken stock can be made in around an hour rather than three to four. The results are slightly different — pressure cooking produces a more opaque stock as the agitation is greater — but the flavour is excellent and the time saving is significant.
          </p>
        </div>

        <GuideRelatedRecipes guideSlug="proper-stock" />

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

export default GuideProperStock;
