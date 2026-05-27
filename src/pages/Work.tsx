import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import ImageWithCaption from "@/components/ImageWithCaption";

const projects = [
  {
    id: "seasonal-italian-cuisine",
    title: "Seasonal Italian Cuisine",
    category: "Restaurant Editorial",
    description: "A celebration of authentic Italian flavours, captured through the lens of natural light and earthy textures. Shot for Osteria del Tempo in Milan.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=85",
    images: [
      {
        src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=85",
        caption: "Handmade tagliatelle, wild mushrooms",
        subcaption: "Natural window light",
      },
      {
        src: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=1200&q=85",
        caption: "Fresh burrata, heirloom tomatoes",
        subcaption: "Soft afternoon glow",
      },
      {
        src: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1200&q=85",
        caption: "Risotto alla Milanese",
        subcaption: "Warm golden tones",
      },
    ],
  },
  {
    id: "artisan-bakery-series",
    title: "Artisan Bakery Series",
    category: "Branding Campaign",
    description: "Capturing the soul of slow-fermented bread and handcrafted pastries. A visual story of flour, time, and human imperfection for Forno Antico.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=85",
    images: [
      {
        src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=85",
        caption: "Sourdough, 72-hour fermentation",
        subcaption: "Rustic morning light",
      },
      {
        src: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=1200&q=85",
        caption: "French croissants, laminated dough",
        subcaption: "Golden butter tones",
      },
      {
        src: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=85",
        caption: "Pain de campagne, hand-scored",
        subcaption: "Earthy textures",
      },
    ],
  },
  {
    id: "fine-dining-experience",
    title: "Fine Dining Experience",
    category: "Chef Tasting Menu",
    description: "Documenting the artistry of a 12-course tasting menu. Minimalist compositions that honour the chef's vision at Ristorante Stellare.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
    images: [
      {
        src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
        caption: "Amuse-bouche, edible flowers",
        subcaption: "Controlled studio light",
      },
      {
        src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=85",
        caption: "Wagyu beef, bone marrow glaze",
        subcaption: "Dramatic contrast",
      },
      {
        src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=85",
        caption: "Deconstructed tiramisu",
        subcaption: "Minimalist presentation",
      },
    ],
  },
];

const Work = () => {
  return (
    <Layout>
      <Helmet>
        <title>Our Work | Stir & Simmer</title>
        <meta name="description" content="Selected food photography projects — editorial collaborations, brand campaigns and fine dining experiences captured with natural light." />
        <meta name="keywords" content="food photography portfolio, editorial food photography, restaurant photography, brand campaign photography" />
        <link rel="canonical" href="https://stirandsimmer.co.uk/work" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/work" />
        <meta property="og:title" content="Our Work | Stir & Simmer" />
        <meta property="og:description" content="Selected food photography projects — editorial collaborations, brand campaigns and fine dining experiences captured with natural light." />
        <meta property="og:image" content={projects[0].image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Work | Stir & Simmer" />
        <meta name="twitter:description" content="Selected food photography projects — editorial collaborations, brand campaigns and fine dining experiences captured with natural light." />
        <meta name="twitter:image" content={projects[0].image} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Work — Stir & Simmer",
          "url": "https://stirandsimmer.co.uk/work",
          "description": "Selected food photography projects — editorial collaborations, brand campaigns and fine dining experiences captured with natural light.",
          "hasPart": projects.map((p) => ({
            "@type": "CreativeWork",
            "name": p.title,
            "genre": p.category,
            "description": p.description,
            "image": p.image
          }))
        })}</script>
      </Helmet>
      {/* Header */}
      <section className="section-breathing pb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h1 className="heading-display mb-6">Work</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Selected projects from editorial collaborations, brand campaigns, 
            and fine dining experiences.
          </p>
        </div>
      </section>

      {/* Projects Grid - Asymmetric */}
      <section className="pb-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-y-32">
            {/* Project 1 - Featured */}
            <div className="md:col-span-12">
              <ProjectCard
                title={projects[0].title}
                category={projects[0].category}
                description={projects[0].description}
                image={projects[0].image}
                size="featured"
                floatDelay={0}
              />
            </div>

            {/* Project 1 - Additional Images */}
            <div className="md:col-span-5">
              <ImageWithCaption
                src={projects[0].images[1].src}
                alt={projects[0].images[1].caption || ""}
                caption={projects[0].images[1].caption}
                subcaption={projects[0].images[1].subcaption}
                aspectRatio="portrait"
                floatDelay={1}
              />
            </div>
            <div className="md:col-span-5 md:col-start-8 md:pt-24">
              <ImageWithCaption
                src={projects[0].images[2].src}
                alt={projects[0].images[2].caption || ""}
                caption={projects[0].images[2].caption}
                subcaption={projects[0].images[2].subcaption}
                aspectRatio="landscape"
                floatDelay={2}
              />
            </div>

            {/* Divider */}
            <div className="md:col-span-12 py-8" />

            {/* Project 2 */}
            <div className="md:col-span-6">
              <ProjectCard
                title={projects[1].title}
                category={projects[1].category}
                description={projects[1].description}
                image={projects[1].image}
                size="large"
                floatDelay={3}
              />
            </div>
            <div className="md:col-span-5 md:col-start-8 md:mt-32">
              <ImageWithCaption
                src={projects[1].images[1].src}
                alt={projects[1].images[1].caption || ""}
                caption={projects[1].images[1].caption}
                subcaption={projects[1].images[1].subcaption}
                aspectRatio="landscape"
                floatDelay={4}
              />
              <div className="mt-12">
                <ImageWithCaption
                  src={projects[1].images[2].src}
                  alt={projects[1].images[2].caption || ""}
                  caption={projects[1].images[2].caption}
                  subcaption={projects[1].images[2].subcaption}
                  aspectRatio="square"
                  floatDelay={5}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="md:col-span-12 py-8" />

            {/* Project 3 */}
            <div className="md:col-span-10 md:col-start-2">
              <ProjectCard
                title={projects[2].title}
                category={projects[2].category}
                description={projects[2].description}
                image={projects[2].image}
                size="featured"
                floatDelay={0}
              />
            </div>
            <div className="md:col-span-4 md:col-start-2">
              <ImageWithCaption
                src={projects[2].images[1].src}
                alt={projects[2].images[1].caption || ""}
                caption={projects[2].images[1].caption}
                subcaption={projects[2].images[1].subcaption}
                aspectRatio="portrait"
                floatDelay={1}
              />
            </div>
            <div className="md:col-span-4 md:col-start-7">
              <ImageWithCaption
                src={projects[2].images[2].src}
                alt={projects[2].images[2].caption || ""}
                caption={projects[2].images[2].caption}
                subcaption={projects[2].images[2].subcaption}
                aspectRatio="portrait"
                floatDelay={2}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Work;
