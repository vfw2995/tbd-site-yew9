import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@workspace/ui/input";
import { Label } from "@workspace/ui/label";
import { Button } from "@workspace/ui/button";
import { loginAdmin, setAdminToken, getAdminToken, getMe, ApiError } from "@/lib/api";
import { Building2, Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!getAdminToken()) return;
    getMe().then(() => setLocation("/admin")).catch(() => {});
  }, [setLocation]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginAdmin(username, password);
      setAdminToken(res.token);
      setLocation("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Amanda Admin</h1>
          <p className="text-primary-foreground/70 text-sm uppercase tracking-widest">Content Console</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-background rounded-2xl shadow-2xl p-8 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="u">Username</Label>
            <Input
              id="u"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p">Password</Label>
            <Input
              id="p"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 text-white h-11"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Sign In
          </Button>
        </form>
        <p className="text-center text-xs text-primary-foreground/50 mt-6">
          Authorized users only.
        </p>
      </div>
    </div>
  );
}
