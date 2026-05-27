import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#2C2416", color: "#F5EAD8", borderTop: "1px solid rgba(245,234,216,0.15)" }}>
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-xl" style={{ color: "#F5EAD8" }}>Stir & Simmer</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(245,234,216,0.7)" }}>
              Delicious recipes crafted with love, flavour, and fresh ingredients.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4 md:pl-4 lg:pl-8">
            <h4 className="micro-caption" style={{ color: "#C4A97A" }}>Navigate</h4>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/recipes", label: "Recipes" },
                { to: "/kitchen-atlas", label: "Kitchen Atlas" },
                { to: "/guides", label: "Guides" },
                { to: "/meal-planner", label: "Meal Planner" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy", label: "Privacy" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm w-fit opacity-70 hover:opacity-100 transition-all duration-300 hover:translate-x-1"
                  style={{ color: "#F5EAD8" }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="micro-caption" style={{ color: "#C4A97A" }}>Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:hello@stirandsimmer.co.uk"
                className="block opacity-70 hover:opacity-100 transition-all duration-300 hover:translate-x-1"
                style={{ color: "#F5EAD8" }}
              >
                hello@stirandsimmer.co.uk
              </a>
              <a
                href="https://www.instagram.com/stirandsimmeruk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 opacity-70 hover:opacity-100 transition-all duration-300 hover:translate-x-1"
                style={{ color: "#F5EAD8" }}
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
                <span>@stirandsimmeruk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(245,234,216,0.15)" }}>
          <p className="text-xs" style={{ color: "rgba(245,234,216,0.6)" }}>
            © {currentYear} Stir & Simmer. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(245,234,216,0.6)" }}>
            Crafted with intention
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
