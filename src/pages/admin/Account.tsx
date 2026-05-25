import { useState } from "react";
import { Input } from "@workspace/ui/input";
import { Label } from "@workspace/ui/label";
import { Button } from "@workspace/ui/button";
import { changePassword, type AmandaUser } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

export default function Account({ user }: { user: AmandaUser }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (next.length < 8) return setErr("New password must be at least 8 characters.");
    if (next !== confirm) return setErr("New passwords don't match.");
    setSaving(true);
    try {
      await changePassword(current, next);
      toast({ title: "Password changed" });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (e) {
      setErr((e as Error).message);
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Account</p>
        <h1 className="text-3xl font-serif font-bold">Your profile</h1>
      </header>
      <div className="bg-background border border-border rounded-xl p-6 space-y-3">
        <h2 className="font-serif font-bold text-lg">Profile</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">Display Name</dt><dd className="font-semibold">{user.displayName}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">Username</dt><dd className="font-semibold">{user.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Role</dt><dd className="font-semibold">{user.role}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={submit} className="bg-background border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-serif font-bold text-lg flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</h2>
        <div className="space-y-1.5"><Label>Current password</Label><Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>New password</Label><Input type="password" value={next} onChange={(e) => setNext(e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Confirm new password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
        {err && <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{err}</div>}
        <Button type="submit" disabled={saving} className="bg-secondary hover:bg-secondary/90 text-white">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Update Password
        </Button>
      </form>
    </div>
  );
}
