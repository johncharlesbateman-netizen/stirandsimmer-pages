import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "ss_cookie_consent_v1";

type Choice = "all" | "essential" | null;

const readChoice = (): Choice => {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "all" || v === "essential") return v;
  } catch {
    /* ignore */
  }
  return null;
};

const writeChoice = (c: Exclude<Choice, null>) => {
  try {
    localStorage.setItem(STORAGE_KEY, c);
  } catch {
    /* ignore */
  }
};

/**
 * Brand-styled cookie consent banner. Persists the user's choice in
 * localStorage so the banner only appears until first interaction.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);

  useEffect(() => {
    // In production, the prerender emits a fully interactive static
    // banner (#cc-static) and sets window.__hasStaticCookieBanner. That
    // banner owns the UX end-to-end, so React should not duplicate it.
    if (typeof window !== "undefined" && (window as unknown as { __hasStaticCookieBanner?: boolean }).__hasStaticCookieBanner) {
      return;
    }
    // Dev / non-prerendered fallback: render the React banner as before.
    if (readChoice() === null) setVisible(true);
  }, []);

  const acceptAll = () => {
    writeChoice("all");
    setVisible(false);
  };
  const rejectAll = () => {
    writeChoice("essential");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[55] px-4 pb-4 pt-3 md:px-6 md:pb-6"
    >
      <div
        className="mx-auto max-w-3xl rounded-lg border shadow-2xl px-5 py-4 md:px-6 md:py-5"
        style={{
          backgroundColor: "#1a0e00",
          color: "#f5ead6",
          borderColor: "rgba(245, 234, 214, 0.12)",
        }}
      >
        {!showPrefs ? (
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 text-sm leading-relaxed" style={{ color: "#f5ead6" }}>
              We use cookies to improve your experience, analyse traffic and
              show relevant content. See our{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-2 hover:opacity-90"
                style={{ color: "#f5ead6" }}
              >
                privacy policy
              </Link>
              .
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:shrink-0">
              <button
                type="button"
                onClick={() => setShowPrefs(true)}
                className="text-sm underline underline-offset-2 hover:opacity-90"
                style={{ color: "rgba(245, 234, 214, 0.7)" }}
              >
                Manage preferences
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="text-sm underline underline-offset-2 hover:opacity-90"
                style={{ color: "rgba(245, 234, 214, 0.7)" }}
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C97B1A", color: "#1a0e00" }}
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm" style={{ color: "#f5ead6" }}>
            <h2 className="font-display text-lg" style={{ color: "#f5ead6" }}>
              Cookie preferences
            </h2>
            <ul className="space-y-2">
              <li>
                <strong style={{ color: "#f5ead6" }}>Essential</strong>{" "}
                <span style={{ color: "rgba(245, 234, 214, 0.75)" }}>
                  — always on. Required for the site to work.
                </span>
              </li>
              <li>
                <strong style={{ color: "#f5ead6" }}>Analytics & marketing</strong>{" "}
                <span style={{ color: "rgba(245, 234, 214, 0.75)" }}>
                  — help us improve the site and show relevant content.
                </span>
              </li>
            </ul>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPrefs(false)}
                className="text-sm underline underline-offset-2 hover:opacity-90"
                style={{ color: "rgba(245, 234, 214, 0.7)" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="text-sm underline underline-offset-2 hover:opacity-90"
                style={{ color: "rgba(245, 234, 214, 0.7)" }}
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C97B1A", color: "#1a0e00" }}
              >
                Accept all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
