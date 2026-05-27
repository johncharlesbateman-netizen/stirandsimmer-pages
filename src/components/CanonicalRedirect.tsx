import { useEffect } from "react";

const CANONICAL_HOST = "stirandsimmer.co.uk";

/**
 * Client-side URL normaliser. On the production custom domain, redirects:
 *  - www.stirandsimmer.co.uk → stirandsimmer.co.uk
 *  - any path with a trailing slash (other than "/") → version without it
 * Lovable previews and localhost are left alone.
 */
const CanonicalRedirect = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { hostname, pathname, search, hash, protocol } = window.location;

    const isApex = hostname === CANONICAL_HOST;
    const isWww = hostname === `www.${CANONICAL_HOST}`;
    if (!isApex && !isWww) return;

    let nextPath = pathname;
    if (nextPath.length > 1 && nextPath.endsWith("/")) {
      nextPath = nextPath.replace(/\/+$/, "") || "/";
    }

    const needsHostFix = isWww;
    const needsPathFix = nextPath !== pathname;
    if (!needsHostFix && !needsPathFix) return;

    const target = `${protocol}//${CANONICAL_HOST}${nextPath}${search}${hash}`;
    window.location.replace(target);
  }, []);

  return null;
};

export default CanonicalRedirect;
