import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const previous = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = previous;
      };
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    // The prerender injects a fixed-position <img id="lcp-hero"> + overlay
    // into the homepage HTML for LCP. If a non-home route ends up being
    // served that HTML (SPA fallback or a stale prerender), the hero stays
    // pinned across the viewport and hides the page content below it.
    // Strip those nodes on any non-home route — Index owns its own
    // dismissal via .lcp-hero-dismissed when it's actually mounted.
    if (pathname !== "/") {
      document.getElementById("lcp-hero")?.remove();
      document.getElementById("lcp-hero-overlay")?.remove();
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
