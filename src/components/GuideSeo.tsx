import { Helmet } from "react-helmet-async";
import { getGuideMeta, SITE_ORIGIN } from "@/lib/guideMeta";

type Props = { slug: string };

const GuideSeo = ({ slug }: Props) => {
  const meta = getGuideMeta(slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.name,
    description: meta.description,
    image: [meta.image],
    datePublished: meta.publishedTime,
    dateModified: meta.modifiedTime,
    author: {
      "@type": "Organization",
      name: meta.author,
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "Stir & Simmer",
      url: SITE_ORIGIN,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": meta.url,
    },
  };

  // BreadcrumbList JSON-LD is emitted by the shared <Breadcrumbs> component
  // rendered in each guide's hero — keeping it there avoids duplicates.

  // (preconnect hints live in index.html)

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="author" content={meta.author} />
      <link rel="canonical" href={meta.url} />

      {/* Preconnect to pexels is already in index.html sitewide */}
      {/* Preload the guide's hero/key image so it's cached for the page,
          social previews and any in-page rendering */}
      <link rel="preload" as="image" href={meta.image} fetchPriority="high" />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:site_name" content="Stir & Simmer" />
      <meta property="article:published_time" content={meta.publishedTime} />
      <meta property="article:modified_time" content={meta.modifiedTime} />
      <meta property="article:author" content={meta.author} />
      <meta property="og:author" content={meta.author} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
    </Helmet>
  );
};

export default GuideSeo;
