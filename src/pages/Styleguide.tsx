import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import ImageWithCaption from "@/components/ImageWithCaption";

const colors = [
  { name: "Background", variable: "--background", class: "bg-background", description: "Warm off-white" },
  { name: "Foreground", variable: "--foreground", class: "bg-foreground", description: "Soft charcoal" },
  { name: "Muted", variable: "--muted", class: "bg-muted", description: "Light cream" },
  { name: "Accent", variable: "--accent", class: "bg-accent", description: "Terracotta" },
  { name: "Terracotta", variable: "--terracotta", class: "bg-terracotta", description: "Earthy warm" },
  { name: "Olive", variable: "--olive", class: "bg-olive", description: "Natural green" },
  { name: "Wine", variable: "--wine", class: "bg-wine", description: "Deep burgundy" },
];

const Styleguide = () => {
  return (
    <Layout>
      <Helmet>
        <title>Styleguide | Stir & Simmer</title>
        <meta name="description" content="Internal design system reference for Stir & Simmer — colours, typography, spacing and editorial layout patterns." />
        <meta name="keywords" content="food photography portfolio design system, editorial layout" />
        <link rel="canonical" href="https://stirandsimmer.co.uk/styleguide" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/styleguide" />
        <meta property="og:title" content="Styleguide | Stir & Simmer" />
        <meta property="og:description" content="Internal design system reference for Stir & Simmer — colours, typography, spacing and editorial layout patterns." />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Styleguide | Stir & Simmer" />
        <meta name="twitter:description" content="Internal design system reference for Stir & Simmer — colours, typography, spacing and editorial layout patterns." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "name": "Styleguide — Stir & Simmer",
          "url": "https://stirandsimmer.co.uk/styleguide",
          "description": "Internal design system reference for Stir & Simmer — colours, typography, spacing and editorial layout patterns.",
          "about": "Design system documentation",
          "audience": { "@type": "Audience", "audienceType": "Designers and Developers" }
        })}</script>
      </Helmet>
      {/* Header */}
      <section className="section-breathing pb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h1 className="heading-display mb-6">Styleguide</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            A visual documentation of the design system powering this portfolio. 
            Inspired by editorial magazines and photography books.
          </p>
        </div>
      </section>

      {/* Color Palette */}
      <section className="pb-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="heading-section mb-12">Colour Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {colors.map((color) => (
              <div key={color.name} className="space-y-3">
                <div 
                  className={`aspect-square ${color.class} border border-border`}
                />
                <div>
                  <p className="text-sm font-medium">{color.name}</p>
                  <p className="micro-caption">{color.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="pb-24 border-t border-border pt-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="heading-section mb-12">Typography</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Display Font */}
            <div className="space-y-8">
              <div>
                <p className="micro-caption mb-4">Display / Headings</p>
                <p className="font-display text-4xl">Playfair Display</p>
              </div>
              
              <div className="space-y-4">
                <p className="heading-display">Display Heading</p>
                <p className="text-sm text-muted-foreground">
                  text-4xl md:text-6xl lg:text-7xl • font-normal • tracking-tight
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="heading-editorial">Editorial Heading</p>
                <p className="text-sm text-muted-foreground">
                  text-3xl md:text-4xl lg:text-5xl • font-normal
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="heading-section">Section Heading</p>
                <p className="text-sm text-muted-foreground">
                  text-2xl md:text-3xl • font-normal
                </p>
              </div>
            </div>

            {/* Body Font */}
            <div className="space-y-8">
              <div>
                <p className="micro-caption mb-4">Body / UI</p>
                <p className="font-body text-4xl">DM Sans</p>
              </div>
              
              <div className="space-y-4">
                <p className="body-editorial">
                  Body text styled for long-form reading. Comfortable line-height 
                  and letter-spacing for editorial content.
                </p>
                <p className="text-sm text-muted-foreground">
                  text-base md:text-lg • leading-relaxed
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="micro-caption">Micro Caption Style</p>
                <p className="text-sm text-muted-foreground mt-2">
                  text-xs • uppercase • tracking-wider • text-muted-foreground
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing System */}
      <section className="pb-24 border-t border-border pt-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="heading-section mb-12">Spacing & Layout</h2>
          
          <div className="space-y-12">
            <div>
              <p className="micro-caption mb-4">Section Breathing</p>
              <p className="text-muted-foreground mb-6">
                Generous vertical rhythm to let the design breathe.
              </p>
              <div className="flex items-end gap-4">
                <div className="w-8 bg-accent h-20" />
                <div className="w-8 bg-accent h-32" />
                <div className="w-8 bg-accent h-40" />
                <div className="text-sm text-muted-foreground">
                  py-20 → py-32 → py-40 (responsive)
                </div>
              </div>
            </div>

            <div>
              <p className="micro-caption mb-4">Container Padding</p>
              <p className="text-muted-foreground">
                px-6 (mobile) → px-12 (tablet) → px-20 (desktop)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Captions */}
      <section className="pb-24 border-t border-border pt-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="heading-section mb-12">Editorial Image Captions</h2>
          
          <p className="text-muted-foreground mb-12 max-w-xl">
            Each image features micro-captions that whisper details about the subject — 
            ingredients, lighting, or mood. Subtle but informative.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ImageWithCaption
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=85"
              alt="Example image with caption"
              caption="Fresh basil, San Marzano tomatoes"
              subcaption="Warm afternoon light"
              aspectRatio="landscape"
            />
            <ImageWithCaption
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=85"
              alt="Example image with caption"
              caption="Sourdough, 72-hour fermentation"
              subcaption="Rustic morning light"
              aspectRatio="landscape"
            />
          </div>
        </div>
      </section>

      {/* Grid Examples */}
      <section className="pb-24 border-t border-border pt-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="heading-section mb-12">Asymmetric Grid</h2>
          
          <p className="text-muted-foreground mb-12 max-w-xl">
            The layout uses a 12-column grid with intentional asymmetry. 
            Images are placed off-centre to create visual tension and editorial flow.
          </p>
          
          <div className="grid grid-cols-12 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 grid grid-cols-12 gap-4">
            <div className="col-span-7 h-48 bg-accent/20 flex items-center justify-center">
              <span className="micro-caption">col-span-7</span>
            </div>
            <div className="col-span-5 h-48 bg-accent/20 flex items-center justify-center">
              <span className="micro-caption">col-span-5</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Styleguide;
