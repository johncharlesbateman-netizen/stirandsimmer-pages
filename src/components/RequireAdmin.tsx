import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl mb-3">Not authorised</h1>
          <p className="text-muted-foreground text-sm">
            Your account doesn't have admin access.
          </p>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
