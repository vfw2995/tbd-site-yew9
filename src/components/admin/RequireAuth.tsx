import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { getMe, type AmandaUser, getAdminToken, clearAdminToken } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface AuthState {
  loading: boolean;
  user: AmandaUser | null;
}

export function RequireAuth({ children }: { children: (user: AmandaUser) => ReactNode }) {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AuthState>({ loading: true, user: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getAdminToken()) {
        setLocation("/admin/login");
        return;
      }
      try {
        const res = await getMe();
        if (!cancelled) setState({ loading: false, user: res.user });
      } catch {
        if (!cancelled) {
          clearAdminToken();
          setLocation("/admin/login");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [setLocation]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!state.user) return null;
  return <>{children(state.user)}</>;
}
