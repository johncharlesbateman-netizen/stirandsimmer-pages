import { useState } from "react";
import contactBehindScenes from "@/assets/contact-behind-scenes.webp";
import { Helmet } from "react-helmet-async";
import { Instagram, MailCheck } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `contact-${crypto.randomUUID()}`;
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-form-notification",
          idempotencyKey,
          templateData: {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            submittedAt: new Date().toLocaleString("en-GB", {
              dateStyle: "long",
              timeStyle: "short",
            }),
          },
        },
      });

      if (error) throw error;

      setFormData({ name: "", email: "", message: "" });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Contact form submission failed", err);
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again or email us directly at hello@stirandsimmer.co.uk.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact | Stir & Simmer</title>
        <meta name="description" content="Get in touch with Stir & Simmer. We'd love to hear from you — questions, suggestions, or just to say hello." />
        <link rel="canonical" href="https://stirandsimmer.co.uk/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/contact" />
        <meta property="og:title" content="Contact | Stir & Simmer" />
        <meta property="og:description" content="Get in touch with Stir & Simmer. We'd love to hear from you — questions, suggestions, or just to say hello." />
        <meta property="og:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact | Stir & Simmer" />
        <meta name="twitter:description" content="Get in touch with Stir & Simmer. We'd love to hear from you — questions, suggestions, or just to say hello." />
        <meta name="twitter:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact | Stir & Simmer",
          url: "https://stirandsimmer.co.uk/contact",
          description: "Get in touch with Stir & Simmer. We'd love to hear from you — questions, suggestions, or just to say hello.",
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://stirandsimmer.co.uk/" },
            { "@type": "ListItem", position: 2, name: "Contact", item: "https://stirandsimmer.co.uk/contact" },
          ],
        })}</script>
      </Helmet>

      <PageHero
        title="Get in touch"
        subtitle="A question, a recipe request, or just want to say hello — we'd love to hear from you."
        imageId="1438672"
        imageAlt="A rustic kitchen table with notebook, coffee and ingredients"
      />
      {/* Header */}
      <section className="section-breathing pb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            {/* Form */}
            <div className="md:col-span-7">
              
              <p className="text-lg text-muted-foreground mb-12 max-w-lg">
                Have a recipe request or a question?
                Drop us a message and we'll get back to you within 48 hours.
              </p>

              {isSubmitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="border border-foreground/15 bg-muted/40 px-8 py-10 md:px-10 md:py-12 flex flex-col items-start gap-6 max-w-xl"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground">
                    <MailCheck className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-display text-2xl md:text-3xl">
                      Thank you for your message!
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We'll be in touch soon — usually within 48 hours.
                      In the meantime, why not browse the latest recipes?
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="text-sm tracking-wider uppercase"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-describedby={Object.keys(errors).length > 0 ? "contact-error-summary" : undefined}>
                  {Object.keys(errors).length > 0 && (
                    <div
                      id="contact-error-summary"
                      role="alert"
                      aria-live="assertive"
                      className="border border-destructive/40 bg-destructive/5 text-destructive rounded-md p-4 text-sm"
                    >
                      <p className="font-medium mb-1">Please fix the following before sending:</p>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {errors.name && <li>{errors.name}</li>}
                        {errors.email && <li>{errors.email}</li>}
                        {errors.message && <li>{errors.message}</li>}
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="micro-caption">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className="bg-transparent border-border focus:border-foreground transition-colors"
                      />
                      {errors.name && (
                        <p id="name-error" className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="micro-caption">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className="bg-transparent border-border focus:border-foreground transition-colors"
                      />
                      {errors.email && (
                        <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="micro-caption">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ask us anything about a recipe, suggest a dish, or just say hello…"
                      rows={6}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className="bg-transparent border-border focus:border-foreground transition-colors resize-none"
                    />
                    {errors.message && (
                      <p id="message-error" className="text-sm text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting || undefined}
                    className="w-full md:w-auto px-12 text-sm tracking-wider uppercase"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="md:col-span-4 md:col-start-9 space-y-12 md:pt-32">
              <div>
                <h3 className="micro-caption mb-4">Email</h3>
                <p className="text-lg">hello@stirandsimmer.co.uk</p>
              </div>

              <div>
                <h3 className="micro-caption mb-4">Based</h3>
                <p className="text-lg">Online, everywhere</p>
                <p className="text-muted-foreground mt-2">New recipes published when we have something worth sharing</p>
              </div>

              <div>
                <h3 className="micro-caption mb-4">Social</h3>
                <div className="space-y-2">
                  <a
                    href="https://www.instagram.com/stirandsimmeruk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lg editorial-link w-fit"
                  >
                    <Instagram className="w-5 h-5" aria-hidden="true" />
                    <span>@stirandsimmeruk</span>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="micro-caption mb-4">Response Time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We love hearing from fellow food lovers and will do our best
                  to get back to you within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="pb-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <figure>
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={contactBehindScenes}
                alt="Behind the scenes at Stir & Simmer — chef plating a dish in the kitchen"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width={1200}
                height={514}
              />
            </div>
            <figcaption className="micro-caption mt-4">Behind the scenes — In the kitchen</figcaption>
          </figure>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
