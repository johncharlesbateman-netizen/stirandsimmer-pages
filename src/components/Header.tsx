import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { session, isAdmin, signOut } = useAuth();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/recipes", label: "Recipes" },
    { to: "/kitchen-atlas", label: "Kitchen Atlas" },
    { to: "/guides", label: "Guides" },
    { to: "/meal-planner", label: "Meal Planner" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-500">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="font-display text-xl tracking-wide hover:opacity-70 transition-opacity duration-300">
            Stir & Simmer
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-wide transition-all duration-300 hover:opacity-60 hover:tracking-wider ${
                  isActive(link.to) ? "underline underline-offset-4 decoration-foreground/30" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin/recipes/new"
                className="text-sm tracking-wide px-3 py-1.5 rounded-md border border-border hover:bg-secondary transition-colors duration-300"
              >
                + New recipe
              </Link>
            )}
            {session ? (
              <button
                onClick={handleSignOut}
                className="text-sm tracking-wide opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                className={`text-sm tracking-wide transition-all duration-300 hover:opacity-60 hover:tracking-wider ${
                  isActive("/auth") ? "underline underline-offset-4 decoration-foreground/30" : ""
                }`}
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-transform duration-300 hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background border-b border-border overflow-hidden transition-all duration-500 ease-out ${
          mobileMenuOpen ? 'max-h-[80vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 border-b-0'
        }`}
      >
        <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg tracking-wide transition-all duration-300 hover:opacity-60 hover:translate-x-2 ${
                isActive(link.to) ? "underline underline-offset-4 decoration-foreground/30" : ""
              }`}
              style={{
                transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin/recipes/new"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg tracking-wide opacity-100 hover:translate-x-2 transition-transform duration-300"
            >
              + New recipe
            </Link>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="text-left text-lg tracking-wide opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg tracking-wide transition-all duration-300 hover:opacity-60 hover:translate-x-2 ${
                isActive("/auth") ? "underline underline-offset-4 decoration-foreground/30" : ""
              }`}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
