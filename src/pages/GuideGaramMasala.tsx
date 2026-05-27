import Breadcrumbs from "@/components/Breadcrumbs";
import GuideSeo from "@/components/GuideSeo";
import GuideRelatedRecipes from "@/components/GuideRelatedRecipes";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GuideTOC from "@/components/GuideTOC";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SPICES = [
  {
    id: "cumin",
    name: "Cumin seeds",
    intro:
      "The earthy backbone of garam masala. Without cumin, the blend has no foundation.",
    method:
      "Use whole seeds, never pre-ground. Toast them in a dry pan over a medium heat until they darken a shade and release a warm, nutty aroma — about a minute. Shake the pan constantly. The moment you can smell them properly, take them off the heat.",
    uses: "Provides the savoury, earthy base note that anchors every other spice in the blend.",
    mistake:
      "Walking away from the pan. Cumin goes from fragrant to bitter in seconds.",
  },
  {
    id: "coriander",
    name: "Coriander seeds",
    intro:
      "The bright, citrussy counterweight to cumin. Where cumin grounds the blend, coriander lifts it.",
    method:
      "Toast whole seeds in the same dry pan until they smell sweet and slightly floral. They are more forgiving than cumin but still need watching. You will hear them crackle gently when they are ready.",
    uses: "Adds gentle sweetness and a fresh, almost lemony top note that stops the blend feeling heavy.",
    mistake:
      "Skipping the toast. Untoasted coriander tastes flat and dusty.",
  },
  {
    id: "cardamom",
    name: "Green cardamom",
    intro:
      "The most distinctive note in any garam masala. Use too little and the blend feels flat. Use too much and it tastes like soap.",
    method:
      "Crack the green pods open with the flat of a knife and remove the small black seeds inside. Discard the husks. Toast the seeds very briefly — thirty seconds at most — then grind. Always buy whole pods, never pre-ground cardamom.",
    uses: "Brings perfume, warmth and a subtle sweetness that ties the whole blend together.",
    mistake:
      "Throwing whole pods into the grinder. The papery husks are bitter and ruin the texture.",
  },
  {
    id: "cinnamon",
    name: "Cinnamon or cassia bark",
    intro:
      "The warmth in garam masala — quite literally, since garam means warm. Indian cooks usually use cassia rather than the sweeter Ceylon cinnamon.",
    method:
      "Break a stick into small pieces with the back of a heavy knife. Toast briefly with the other whole spices. Cassia is harder than Ceylon cinnamon, so make sure your grinder can handle it before adding the pieces whole.",
    uses: "Provides a deep, woody warmth that lingers on the palate after the brighter spices fade.",
    mistake:
      "Using ground cinnamon from a jar. The flavour is a fraction of what you get from a freshly broken stick.",
  },
  {
    id: "cloves",
    name: "Cloves",
    intro:
      "The most powerful spice in the blend. A little goes a very long way.",
    method:
      "Toast briefly with the other whole spices. Use sparingly — four or five cloves is enough for a batch made with a tablespoon each of cumin and coriander. Cloves dominate quickly if you are heavy-handed.",
    uses: "Adds a sharp, almost medicinal warmth that cuts through rich, slow-cooked dishes.",
    mistake:
      "Treating cloves like the other whole spices and using a teaspoonful. The blend will taste of nothing else.",
  },
  {
    id: "black-pepper",
    name: "Black peppercorns",
    intro:
      "Garam masala is meant to warm, and before chillies arrived in India from the Americas, black pepper did all the heavy lifting.",
    method:
      "Toast whole peppercorns with the other spices for thirty seconds or so. Grind with the rest of the blend. Use a generous pinch — pepper provides background heat rather than the front-of-mouth burn you get from chilli.",
    uses: "Gives the blend its gentle, lingering heat and rounds out the savoury notes.",
    mistake:
      "Reaching for the pre-ground pepper pot. It has lost most of its volatile oils and tastes dull.",
  },
  {
    id: "nutmeg-mace",
    name: "Nutmeg and mace",
    intro:
      "The optional but transformative finishing touches. Either or both will take your blend from good to memorable.",
    method:
      "Grate fresh nutmeg into the blend after grinding the other spices — never grind a whole nutmeg in a spice grinder, it will gum up the blades. Mace, the lacy red covering of the nutmeg, can be toasted and ground with the rest.",
    uses: "Adds a haunting, slightly sweet warmth that makes the blend feel finished and complete.",
    mistake:
      "Using too much. Nutmeg is potent — a quarter of a whole nut is plenty for a small batch.",
  },
];

const GuideGaramMasala = () => {
  return (
    <Layout>
      <GuideSeo slug="garam-masala" />

      <article className="bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-3xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: "Garam masala" },
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
              Garam masala — a cook's guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Make your own and you will never go back to the jar. The difference is not subtle.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Garam masala literally means warm spice mix. There is no single recipe — every region, every household, every cook has their own version. What follows is a reliable starting point and the principles you need to make it your own. Once you have toasted and ground a batch yourself, the dusty supermarket jar will never look the same again.
            </p>
          </div>
        </header>

        <GuideTOC
          items={[
              { id: "what-garam-masala-actually-is", label: "What garam masala actually is" },
              { id: "why-every-version-is-different", label: "Why every version is different" },
              { id: "the-core-spices", label: "The core spices" },
              ...SPICES.map((s) => ({ id: s.id, label: s.name })),
              { id: "how-to-make-your-own", label: "How to make your own" },
              { id: "a-simple-starting-blend", label: "A simple starting blend" },
              { id: "more-complex-variations", label: "More complex variations" },
              { id: "how-to-use-it", label: "How to use it" },
              { id: "worth-making-your-own", label: "Worth making your own?" },
          ]}
        />

        {/* What it actually is */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="what-garam-masala-actually-is" className="font-display text-3xl md:text-4xl text-foreground mb-6">What garam masala actually is</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            The name translates from Hindi as "warm spice mixture" — and that word warm is important. It doesn't necessarily mean hot. It refers to spices that are considered warming in Ayurvedic tradition — spices that raise body temperature and aid digestion. Think cinnamon, cardamom, cloves, black pepper. Aromatic, fragrant, complex.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Garam masala is not a curry powder. Curry powder is a British invention designed to approximate the flavour of Indian cooking in a single convenient jar. It typically contains turmeric, which gives it that distinctive yellow colour, along with chilli for heat and various other spices.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Garam masala has no fixed recipe. It is not owned by any single culture, region or cook. It belongs to whoever is making it.
          </p>
        </div>

        {/* Why every version is different */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="why-every-version-is-different" className="font-display text-3xl md:text-4xl text-foreground mb-6">Why every version is different</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            This is what makes garam masala genuinely fascinating. Travel across the Indian subcontinent and you'll find wildly different blends all carrying the same name.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            In Punjab the blend tends to be robust and warming — heavy on cumin, coriander and black pepper.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            In Kashmir it becomes more delicate and floral — greater emphasis on cardamom, cinnamon and cloves, sometimes with dried ginger.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            In Bengal you might find it simpler — just three or four spices, used sparingly.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            In Maharashtra it can be more complex and pungent, sometimes including dried coconut or sesame.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            And within each region, every family has its own version. A grandmother's garam masala, made from memory and instinct, passed down through generations, is as personal as a signature.
          </p>
        </div>

        {/* The core spices */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-b border-border">
          <h2  id="the-core-spices" className="font-display text-3xl md:text-4xl text-foreground mb-6">The core spices</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            While no recipe is definitive, certain spices appear consistently across most versions:
          </p>
          <ul className="space-y-4 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li>
              <strong className="text-foreground">Cardamom</strong> — green cardamom pods bring a floral, slightly citrusy warmth that is the backbone of many blends. Black cardamom adds a smokier, more intense note and appears in northern Indian versions.
            </li>
            <li>
              <strong className="text-foreground">Cinnamon</strong> — sweet, warm and aromatic. Used as a stick or in pieces, never pre-ground if you can help it.
            </li>
            <li>
              <strong className="text-foreground">Cloves</strong> — intensely aromatic and slightly numbing. Powerful — use with restraint.
            </li>
            <li>
              <strong className="text-foreground">Cumin</strong> — earthy and warm, usually present in some quantity in most blends.
            </li>
            <li>
              <strong className="text-foreground">Coriander</strong> — milder and slightly citrusy, it softens and rounds out the stronger spices.
            </li>
            <li>
              <strong className="text-foreground">Black pepper</strong> — the original heat source in Indian cooking before chillies arrived from the Americas. Adds sharpness and depth.
            </li>
            <li>
              <strong className="text-foreground">Nutmeg or mace</strong> — used in smaller quantities, adds a subtle sweetness and complexity.
            </li>
          </ul>
        </div>

        {/* Spice sections */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl">
          {SPICES.map((spice, i) => (
            <section
              key={spice.id}
              id={spice.id}
              className={`scroll-mt-24 ${i > 0 ? "mt-16 pt-16 border-t border-border" : ""}`}
            >
              <p className="micro-caption mb-3 text-primary">Spice {i + 1} of {SPICES.length}</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                {spice.name}
              </h2>
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
                {spice.intro}
              </p>

              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                How to prepare it
              </h3>
              <p className="text-base text-foreground/90 leading-relaxed mb-8">
                {spice.method}
              </p>

              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                What it brings to the blend
              </h3>
              <p className="text-base text-foreground/90 leading-relaxed mb-8">
                {spice.uses}
              </p>

              <div className="rounded-lg p-5 md:p-6 border border-border bg-warm-soft">
                <p className="text-xs uppercase tracking-widest font-semibold mb-2 text-muted-foreground">
                  The mistake most home cooks make
                </p>
                <p className="text-base md:text-lg text-foreground">
                  {spice.mistake}
                </p>
              </div>
            </section>
          ))}

        </div>

        {/* How to make your own */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-t border-border">
          <h2  id="how-to-make-your-own" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to make your own</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Making garam masala at home is straightforward and the difference in flavour compared to a shop-bought jar is remarkable.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Start with whole spices wherever possible. Add them to a dry frying pan over a medium heat and toast, shaking the pan regularly, until they become fragrant — usually two to three minutes. Watch carefully; they can burn quickly and burnt spices are bitter and unusable.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Tip onto a plate and leave to cool completely. Never grind warm spices — the heat creates moisture and the powder will clump.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Once cool, grind to a fine powder using a spice grinder or a pestle and mortar. A dedicated coffee grinder works well for this.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Store in an airtight jar away from direct light and heat. Use within two to three months for best flavour — after that it won't be harmful but the potency will fade.
          </p>
        </div>

        {/* A simple starting blend */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-t border-border">
          <h2  id="a-simple-starting-blend" className="font-display text-3xl md:text-4xl text-foreground mb-6">A simple starting blend</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6">
            If you want a place to begin, this is a clean, balanced version that works well across a wide range of dishes:
          </p>
          <ul className="space-y-2 text-base md:text-lg text-foreground/90 leading-relaxed mb-6 list-disc pl-6">
            <li>3 tsp cumin seeds</li>
            <li>3 tsp coriander seeds</li>
            <li>2 tsp green cardamom pods</li>
            <li>1 tsp black peppercorns</li>
            <li>1 x 5cm cinnamon stick, broken</li>
            <li>½ tsp cloves</li>
            <li>¼ tsp nutmeg, freshly grated</li>
          </ul>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Toast, cool and grind as above. This makes enough for several dishes and keeps well.
          </p>
        </div>

        {/* More complex variations */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-t border-border">
          <h2  id="more-complex-variations" className="font-display text-3xl md:text-4xl text-foreground mb-6">More complex variations</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            As you grow more confident you might want to explore richer, more layered blends. Some cooks add dried rose petals for fragrance. Others incorporate bay leaves, star anise or dried ginger. A Kashmiri version might lean heavily into cardamom and use very little cumin.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Some blends — particularly those from certain regions — begin to resemble what we in the West might recognise as curry powder. When dried chillies, turmeric and dried mango powder enter the mix, the blend becomes warmer, more pungent and more complex. These are not wrong — they are simply a different tradition, a different set of influences. But they are a different thing to a classic aromatic garam masala, and worth understanding as such.
          </p>
        </div>

        {/* How to use it */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-t border-border">
          <h2  id="how-to-use-it" className="font-display text-3xl md:text-4xl text-foreground mb-6">How to use it</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            This is perhaps the most important thing to know: garam masala is a finishing spice.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Unlike cumin or coriander seeds, which are bloomed in oil at the start of cooking to build a flavour base, garam masala is typically added in the final minutes — stirred through a curry, a dal or a sauce just before serving. This preserves its fragrance and stops the more delicate aromatic notes from cooking off.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            A small amount goes a long way. Start with half a teaspoon and taste before adding more.
          </p>
        </div>

        {/* Worth making your own? */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 max-w-3xl border-t border-border">
          <h2  id="worth-making-your-own" className="font-display text-3xl md:text-4xl text-foreground mb-6">Worth making your own?</h2>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5">
            Yes. Even once. Not because shop-bought garam masala is bad — some blends are perfectly good — but because making it yourself teaches you something that no recipe can fully convey. You'll understand why cardamom smells the way it does when it hits a hot pan. You'll understand the difference between a blend that's been sitting in a warehouse for eight months and one made twenty minutes ago.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            That understanding changes how you cook.
          </p>
        </div>

        <GuideRelatedRecipes guideSlug="garam-masala" />

        {/* Kitchen Atlas CTA */}
        <section className="w-full py-16 md:py-20 border-t border-border bg-warm-dark text-warm-dark-foreground">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to put it to work?
            </h2>
            <p className="text-base md:text-lg mb-8 text-warm-cream-muted">
              Head to The Kitchen Atlas and explore the Indian recipes waiting for your fresh garam masala.
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

export default GuideGaramMasala;
