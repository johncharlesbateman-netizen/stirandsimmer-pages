import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

interface NewsletterSignupProps {
  className?: string;
  eyebrow?: string;
  headline?: string;
  description?: string;
  variant?: "default" | "compact";
}

import { MAILCHIMP_FORM_ACTION, MAILCHIMP_HIDDEN_BOT_FIELD } from "@/lib/mailchimp";

const schema = z.object({
  fname: z.string().trim().max(60).optional(),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please tick the box to subscribe" }),
  }),
});

const SUCCESS_MESSAGE = "You're in! 🎉 Your first recipes will be on their way soon.";
const ERROR_MESSAGE = "Something went wrong — please try again.";

/**
 * Submit to Mailchimp via JSONP (their `/subscribe/post` endpoint does not
 * support CORS, but `/subscribe/post-json` does support a JSONP callback).
 * Returns true on success, false on Mailchimp-reported error.
 */
const submitToMailchimp = (params: Record<string, string>): Promise<boolean> => {
  return new Promise((resolve) => {
    const jsonUrl = MAILCHIMP_FORM_ACTION.replace("/post?", "/post-json?");
    const cb = `mc_cb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const query = new URLSearchParams(params);
    query.set("c", cb);

    const script = document.createElement("script");
    let settled = false;
    const cleanup = () => {
      delete (window as any)[cb];
      script.remove();
    };
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(false);
    }, 10000);

    (window as any)[cb] = (data: { result?: string }) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      cleanup();
      resolve(data?.result === "success");
    };

    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      cleanup();
      resolve(false);
    };

    script.src = `${jsonUrl}&${query.toString()}`;
    document.body.appendChild(script);
  });
};

const NewsletterSignup = ({
  className = "",
  eyebrow = "Newsletter",
  headline,
  description,
  variant = "default",
}: NewsletterSignupProps) => {
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const result = schema.safeParse({ fname, email, consent });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Please check your details");
      return;
    }

    setStatus("submitting");
    const params: Record<string, string> = {
      EMAIL: email.trim(),
      "gdpr[consent]": "Y",
    };
    if (fname.trim()) params.FNAME = fname.trim();
    if (MAILCHIMP_HIDDEN_BOT_FIELD) params[MAILCHIMP_HIDDEN_BOT_FIELD] = "";

    const ok = await submitToMailchimp(params);
    if (ok) {
      setStatus("success");
      setFname("");
      setEmail("");
      setConsent(false);
    } else {
      setStatus("idle");
      setError(ERROR_MESSAGE);
    }
  };

  const isCompact = variant === "compact";

  return (
    <section
      className={`no-print ${className}`}
      aria-labelledby="newsletter-heading"
      style={{ backgroundColor: "#2C2416", color: "#F5EAD8", borderTop: "1px solid rgba(245,234,216,0.15)" }}
    >
      <div
        className={`container mx-auto px-6 md:px-12 lg:px-20 ${
          isCompact ? "py-16 md:py-20" : "py-20 md:py-28"
        }`}
      >
        <div className="max-w-xl mx-auto text-center">
          {eyebrow && <p className="micro-caption mb-5" style={{ color: "#C4A97A" }}>{eyebrow}</p>}
          <h2
            id="newsletter-heading"
            className={isCompact ? "heading-section mb-4" : "heading-editorial mb-4"}
            style={{ color: "#F5EAD8" }}
          >
            {headline || "Get recipes delivered free"}
          </h2>
          <div className="mx-auto my-6 h-px w-12" style={{ backgroundColor: "rgba(245,234,216,0.3)" }} aria-hidden="true" />
          <p className="leading-relaxed mb-10 max-w-md mx-auto" style={{ color: "rgba(245,234,216,0.75)" }}>
            {description ||
              "An occasional email with new recipes, seasonal ideas and the odd kitchen tip — sent only when we have something worth sharing. No spam, unsubscribe anytime."}
          </p>

          {status === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="max-w-md mx-auto px-6 py-8"
              style={{ backgroundColor: "rgba(245,234,216,0.08)", border: "1px solid rgba(245,234,216,0.2)", color: "#F5EAD8" }}
            >
              <p className="text-base">{SUCCESS_MESSAGE}</p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="space-y-5 max-w-md mx-auto text-left"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-2/5">
                  <label htmlFor="newsletter-fname" className="sr-only">
                    First name (optional)
                  </label>
                  <input
                    id="newsletter-fname"
                    type="text"
                    name="FNAME"
                    maxLength={60}
                    autoComplete="given-name"
                    placeholder="First name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    className="w-full min-h-[48px] px-0 py-3 bg-transparent border-0 border-b focus:outline-none transition-colors rounded-none"
                    style={{ color: "#F5EAD8", borderColor: "rgba(245,234,216,0.25)" }}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="EMAIL"
                    required
                    maxLength={255}
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[48px] px-0 py-3 bg-transparent border-0 border-b focus:outline-none transition-colors rounded-none"
                    style={{ color: "#F5EAD8", borderColor: "rgba(245,234,216,0.25)" }}
                  />
                </div>
              </div>

              {/* Honeypot — Mailchimp's required hidden bot field */}
              {MAILCHIMP_HIDDEN_BOT_FIELD && (
                <div
                  style={{ position: "absolute", left: "-5000px" }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name={MAILCHIMP_HIDDEN_BOT_FIELD}
                    tabIndex={-1}
                    defaultValue=""
                  />
                </div>
              )}

              <label className="flex items-start gap-3 text-xs leading-relaxed cursor-pointer pt-2" style={{ color: "rgba(245,234,216,0.7)" }}>
                <input
                  type="checkbox"
                  name="gdpr[consent]"
                  value="Y"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
                  style={{ accentColor: "#C4A97A" }}
                />
                <span>
                  I agree to receive Stir &amp; Simmer's recipe newsletter and
                  accept the{" "}
                  <Link to="/privacy" className="underline underline-offset-2" style={{ color: "#F5EAD8" }}>
                    privacy policy
                  </Link>
                  . You can unsubscribe at any time.
                </span>
              </label>

              {error && (
                <p className="text-xs" role="alert" style={{ color: "#f0a0a0" }}>
                  {error}
                </p>
              )}

              <div className="pt-3 text-center">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-block px-10 py-4 text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#C4A97A", color: "#2C2416" }}
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
