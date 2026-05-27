import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import aboutKitchen1 from "@/assets/about-kitchen-1.webp";
import aboutKitchen3 from "@/assets/about-kitchen-3.webp";
import aboutKitchen4 from "@/assets/about-kitchen-4.webp";
import kitchenLoop from "@/assets/about-kitchen-loop.mp4.asset.json";


const brandImage = "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=85";

const gridImages = [
  { src: aboutKitchen3, alt: "Hands kneading bread dough on a flour-dusted wooden table" },
  { src: aboutKitchen1, alt: "Fresh seasonal vegetables on a wooden chopping board" },
  { src: aboutKitchen4, alt: "Caramelised onions sizzling in a cast iron skillet" },
];

const About = () => {
  return (
    <Layout hideNewsletter>
      <Helmet>
        <title>About Us | Stir & Simmer</title>
        <meta name="description" content="Learn about Stir & Simmer — who we are, our passion for fresh seasonal cooking, and who our recipes are made for." />
        <meta name="keywords" content="food photographer, editorial food photography, food stylist" />
        <link rel="canonical" href="https://stirandsimmer.co.uk/about" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/about" />
        <meta property="og:title" content="About Us | Stir & Simmer" />
        <meta property="og:description" content="Learn about Stir & Simmer — who we are, our passion for fresh seasonal cooking, and who our recipes are made for." />
        <meta property="og:image" content={brandImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Stir & Simmer" />
        <meta name="twitter:description" content="Learn about Stir & Simmer — who we are, our passion for fresh seasonal cooking, and who our recipes are made for." />
        <meta name="twitter:image" content={brandImage} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About — Stir & Simmer",
          "url": "https://stirandsimmer.co.uk/about",
          "description": "Learn about Stir & Simmer — who we are, our passion for fresh seasonal cooking, and who our recipes are made for.",
          "mainEntity": {
            "@type": "Organization",
            "name": "Stir & Simmer",
            "url": "https://stirandsimmer.co.uk",
            "image": brandImage,
            "description": "We create recipes the same way we enjoy food — with care, curiosity, and a love for fresh, honest ingredients."
          }
        })}</script>
      </Helmet>

      <PageHero
        title="About Stir & Simmer"
        subtitle="Real food, real kitchens, no shortcuts."
        imageId="1640777"
        imageAlt="A warm, lived-in kitchen with fresh ingredients on the counter"
      />
      {/* Intro */}
      <section className="pt-8 md:pt-10 pb-6 md:pb-8">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl space-y-6 body-editorial text-muted-foreground">
            <p className="text-foreground text-xl md:text-2xl font-display leading-relaxed">
              Stir & Simmer is a UK recipe site for people who love good food but don't want cooking to become a project.
            </p>
            <p>
              We started this in a real kitchen, after one too many recipes that called for ingredients you've never heard of, techniques that assumed professional training, or timings that only work if you have the whole afternoon free.
            </p>
            <p>
              That's not most people's reality. So we built something different.
            </p>
          </div>

          <div className="max-w-3xl mt-10 pt-8 border-t border-border">
            <h2 className="heading-section mb-4">How This Started</h2>
            <div className="space-y-4 body-editorial text-muted-foreground">
              <p>
                Every recipe on here comes from actually making it — not once, but enough times to know what goes wrong and how to fix it. The portions are honest. The ingredients come from Tesco, Sainsbury's, Aldi or Waitrose. The methods are written for someone who's cooking after work, not performing for a camera.
              </p>
              <p>
                If a dish isn't worth making, it doesn't go on the site.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mt-10 pt-8 border-t border-border">
            <h2 className="heading-section mb-4">What You'll Find Here</h2>
            <p className="body-editorial text-muted-foreground">
              Quick meals that don't taste like shortcuts. Proper weekend cooking when you have more time. Guides that explain the why, not just the what. And a recipe list that keeps growing — built around what real cooks actually want to eat.
            </p>
          </div>
        </div>
      </section>

      {/* Looping kitchen video */}
      <section className="pb-8">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="relative overflow-hidden rounded-sm aspect-[21/9] bg-foreground">
            <video
              src={kitchenLoop.url}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="A warm UK kitchen with steam rising from a simmering pot"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "saturate(1.05) contrast(1.05) sepia(0.18) brightness(0.92)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply"
              style={{ background: "linear-gradient(180deg, hsl(16 45% 25% / 0.25), hsl(0 0% 10% / 0.45))" }}
            />
            <div className="absolute inset-0 flex items-end p-6 md:p-10">
              <p className="micro-caption text-background/90">A real kitchen, somewhere in the UK</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Stir & Simmer */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl">
            <p className="micro-caption text-accent mb-3">Why Stir & Simmer</p>
            <h2 className="heading-section mb-8">Built for real UK kitchens</h2>

            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              <div>
                <h3 className="font-display text-xl text-foreground mb-4">We cook for</h3>
                <ul className="space-y-3 body-editorial text-muted-foreground">
                  <li>— People cooking after a long day at work</li>
                  <li>— Families feeding fussy eaters without compromise</li>
                  <li>— Anyone who wants weekend cooking to feel like a treat, not a chore</li>
                  <li>— Home cooks who'd rather learn the why than memorise the what</li>
                  <li>— Shoppers who actually use Tesco, Sainsbury's, Aldi and Waitrose</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl text-foreground mb-4">Why UK-specific matters</h3>
                <div className="space-y-4 body-editorial text-muted-foreground">
                  <p>
                    Every measurement is in grams and millilitres. Every oven temperature is in Celsius (with fan settings noted). Every ingredient is something you can actually buy at a British supermarket — no hunting for obscure imports or guessing at conversions.
                  </p>
                  <p>
                    It sounds small. In practice, it's the difference between a recipe that works first time and one that quietly fails on a Tuesday night.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default About;
