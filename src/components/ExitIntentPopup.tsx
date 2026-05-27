import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  MAILCHIMP_FORM_ACTION,
  MAILCHIMP_HIDDEN_BOT_FIELD,
} from "@/lib/mailchimp";

const STORAGE_KEY = "ss_exit_intent_v1";
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MIN_DWELL_MS = 60 * 1000; // 60 seconds

const schema = z.object({
  fname: z.string().trim().max(60).optional(),
  email: z.string().trim().email().max(255),
  consent: z.literal(true),
});

const isPreviewEnvironment = () => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host.endsWith(".lovable.app") ||
    host.endsWith(".lovable.dev") ||
    host.endsWith(".lovableproject.com") ||
    host === "localhost" ||
    host === "127.0.0.1"
  );
};

/**
 * Desktop exit-intent newsletter modal. Shows at most once every 30 days
 * per visitor (tracked in localStorage), only after 60s of dwell time, and
 * only on a genuine exit-intent signal (cursor leaving the top of the
 * viewport). Disabled on touch devices and in the Lovable preview.
 */
const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Never show in the Lovable preview / local dev environments.
    if (isPreviewEnvironment()) return;

    // Skip if already shown / dismissed within the last 30 days.
    try {
      const last = localStorage.getItem(STORAGE_KEY);
      if (last) {
        const ts = Number(last);
        if (Number.isFinite(ts) && Date.now() - ts < COOLDOWN_MS) return;
      }
    } catch {
      return;
    }

    // Skip on touch / coarse-pointer devices — no reliable exit signal.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    // Require at least 60s on the page before arming the trigger so the
    // popup never fires on first page load or for quick bounces.
    let armed = false;
    const armTimer = window.setTimeout(() => {
      armed = true;
    }, MIN_DWELL_MS);

    const onMouseLeave = (e: MouseEvent) => {
      if (!armed) return;
      // Only fire when cursor leaves the top of the viewport.
      if (e.clientY <= 0 && (e.relatedTarget === null || e.target === document.documentElement)) {
        setOpen(true);
        try {
          localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch {
          /* ignore */
        }
        document.removeEventListener("mouseout", onMouseLeave);
      }
    };

    document.addEventListener("mouseout", onMouseLeave);
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", onMouseLeave);
    };
  }, []);

  const close = () => setOpen(false);

  const isConfigured =
    MAILCHIMP_FORM_ACTION &&
    !MAILCHIMP_FORM_ACTION.includes("REPLACE_WITH_YOUR_MAILCHIMP_URL");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    const result = schema.safeParse({ fname, email, consent });
    if (!result.success) {
      e.preventDefault();
      setError("Please enter a valid email and tick the consent box.");
      return;
    }
    if (!isConfigured) {
      e.preventDefault();
      toast({
        title: "Almost there",
        description:
          "Add your Mailchimp form URL to src/lib/mailchimp.ts to enable subscriptions.",
      });
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-heading"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 animate-fade-in"
      onClick={close}
    >
      <div
        className="relative bg-background border border-border max-w-md w-full p-8 md:p-10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="micro-caption mb-3">Before you go</p>
        <h2 id="exit-intent-heading" className="font-display text-2xl md:text-3xl mb-3">
          Get our recipes by email — free
        </h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Join thousands of home cooks getting tried-and-tested recipes
          when we have something worth sharing. Unsubscribe anytime.
        </p>

        <form
          action={MAILCHIMP_FORM_ACTION || undefined}
          method="post"
          target="_blank"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <label htmlFor="exit-fname" className="sr-only">
            First name (optional)
          </label>
          <input
            id="exit-fname"
            type="text"
            name="FNAME"
            maxLength={60}
            autoComplete="given-name"
            placeholder="First name (optional)"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            className="w-full min-h-[44px] px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          <label htmlFor="exit-email" className="sr-only">
            Email address
          </label>
          <input
            id="exit-email"
            type="email"
            name="EMAIL"
            required
            maxLength={255}
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />

          {MAILCHIMP_HIDDEN_BOT_FIELD && (
            <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
              <input type="text" name={MAILCHIMP_HIDDEN_BOT_FIELD} tabIndex={-1} defaultValue="" />
            </div>
          )}

          <label className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed cursor-pointer">
            <input
              type="checkbox"
              name="gdpr[consent]"
              value="Y"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-0.5 w-4 h-4 flex-shrink-0 accent-foreground cursor-pointer"
            />
            <span>
              I agree to receive the newsletter and accept the{" "}
              <Link to="/privacy" className="underline hover:text-foreground" onClick={close}>
                privacy policy
              </Link>
              .
            </span>
          </label>

          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[44px] px-6 py-3 bg-foreground text-background text-sm font-bold tracking-wide hover:bg-foreground/90 transition-colors"
          >
            Subscribe
          </button>
          <button
            type="button"
            onClick={close}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            No thanks
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
