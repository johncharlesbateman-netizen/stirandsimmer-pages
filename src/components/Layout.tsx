import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NewsletterSignup from "./NewsletterSignup";

interface LayoutProps {
  children: ReactNode;
  hideNewsletter?: boolean;
}

const Layout = ({ children, hideNewsletter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-border focus:rounded-md"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-20">{children}</main>
      {!hideNewsletter && <NewsletterSignup />}
      <Footer />
    </div>
  );
};

export default Layout;
