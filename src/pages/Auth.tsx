import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";

const GoogleLogo = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.614z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const googleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!loading && session) {
      navigate("/admin/recipes/new", { replace: true });
    }
  }, [session, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({
          title: "Sign-in failed",
          description: result.error.message ?? "Please try again",
          variant: "destructive",
        });
        setIsSigningIn(false);
        // Return focus to the button so keyboard / screen reader users can retry.
        requestAnimationFrame(() => googleButtonRef.current?.focus());
        return;
      }
      if (result.redirected) return; // browser handles navigation
      // Otherwise session is set and the useEffect routes us.
    } catch (err) {
      toast({
        title: "Sign-in failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
      setIsSigningIn(false);
      requestAnimationFrame(() => googleButtonRef.current?.focus());
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-6 py-20 flex justify-center" role="status">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Loading…</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Sign in | Stir & Simmer</title>
        <link rel="canonical" href="https://stirandsimmer.co.uk/auth" />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="max-w-md mx-auto px-6 py-20">
        <p className="micro-caption mb-2">Admin</p>
        <h1 className="font-display text-4xl mb-3">Sign in</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Sign in with your Google account to manage recipes.
        </p>
        <Button
          ref={googleButtonRef}
          onClick={handleGoogleSignIn}
          className="w-full gap-2"
          size="lg"
          disabled={isSigningIn}
          aria-busy={isSigningIn || undefined}
        >
          {isSigningIn ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span className="sr-only">Signing in…</span>
              <span aria-hidden="true">Signing in…</span>
            </>
          ) : (
            <>
              <GoogleLogo />
              Continue with Google
            </>
          )}
        </Button>
      </div>
    </Layout>
  );
};

export default Auth;
