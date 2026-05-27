import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Privacy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | Stir & Simmer</title>
        <meta
          name="description"
          content="How Stir & Simmer collects, uses and protects your personal data, including newsletter subscriptions, cookies and your rights under UK GDPR."
        />
        <link rel="canonical" href="https://stirandsimmer.co.uk/privacy" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/privacy" />
        <meta property="og:title" content="Privacy Policy | Stir & Simmer" />
        <meta property="og:description" content="How Stir & Simmer collects, uses and protects your personal data, including newsletter subscriptions, cookies and your rights under UK GDPR." />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy | Stir & Simmer" />
        <meta name="twitter:description" content="How Stir & Simmer collects, uses and protects your personal data, including newsletter subscriptions, cookies and your rights under UK GDPR." />
      </Helmet>

      <article className="container mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 max-w-3xl">
        <p className="micro-caption mb-4">Legal</p>
        <h1 className="heading-display mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: 6 May 2026
        </p>

        <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p>
            This privacy policy explains how Stir &amp; Simmer ("we", "us")
            collects, uses and protects information about you when you use
            our website at{" "}
            <Link to="/" className="underline hover:text-foreground">
              stirandsimmer.co.uk
            </Link>
            . We are the data controller for the personal data we hold about
            you. We are committed to protecting your privacy in line with
            the UK GDPR and the Data Protection Act 2018.
          </p>

          <h2 className="heading-section text-foreground mt-10">
            What information we collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Newsletter:</strong> when
              you subscribe, we collect your email address and (optionally)
              your first name. This is processed on the basis of your
              consent.
            </li>
            <li>
              <strong className="text-foreground">Contact form:</strong> if
              you get in touch, we collect the details you provide so we can
              reply.
            </li>
            <li>
              <strong className="text-foreground">Cookies and analytics:</strong>{" "}
              we use a small number of cookies and similar technologies to
              measure how the site is used and to remember preferences (for
              example, dismissing pop-ups).
            </li>
          </ul>

          <h2 className="heading-section text-foreground mt-10">
            How we use your information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>send the recipe newsletter you have subscribed to;</li>
            <li>respond to enquiries and feedback;</li>
            <li>improve the website and the recipes we publish;</li>
            <li>comply with our legal obligations.</li>
          </ul>

          <h2 className="heading-section text-foreground mt-10">
            Who we share your data with
          </h2>
          <p>
            We use Mailchimp (Intuit Inc.) to deliver our newsletter. When
            you subscribe, your details are stored in Mailchimp under our
            account. Mailchimp may transfer data to the United States under
            standard contractual clauses. You can read{" "}
            <a
              href="https://mailchimp.com/legal/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Mailchimp's privacy policy
            </a>{" "}
            for more information.
          </p>
          <p>
            We do not sell your personal data to third parties.
          </p>

          <h2 className="heading-section text-foreground mt-10">
            How long we keep your data
          </h2>
          <p>
            We keep newsletter subscriptions until you unsubscribe. You can
            unsubscribe at any time using the link in any email from us, or
            by contacting us. We keep enquiry messages for as long as they
            are useful for resolving your query.
          </p>

          <h2 className="heading-section text-foreground mt-10">Your rights</h2>
          <p>Under UK GDPR you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>access the personal data we hold about you;</li>
            <li>ask us to correct or delete it;</li>
            <li>withdraw consent at any time;</li>
            <li>
              complain to the Information Commissioner's Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                ico.org.uk
              </a>
              .
            </li>
          </ul>

          <h2 className="heading-section text-foreground mt-10">Contact</h2>
          <p>
            If you have any questions about this policy or want to exercise
            your rights, please get in touch via our{" "}
            <Link to="/contact" className="underline hover:text-foreground">
              contact page
            </Link>
            .
          </p>
        </div>
      </article>
    </Layout>
  );
};

export default Privacy;
