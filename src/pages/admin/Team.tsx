import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  resetAdminUserPassword,
  type AdminUserRecord,
  type AmandaUser,
} from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Button } from "@workspace/ui/button";
import { Input } from "@workspace/ui/input";
import { Label } from "@workspace/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/select";
import { Badge } from "@workspace/ui/badge";
import { Loader2, UserPlus, KeyRound, UserX, UserCheck, Pencil } from "lucide-react";

type Role = "admin" | "super_admin";

interface CreateForm {
  username: string;
  display_name: string;
  password: string;
  role: Role;
}

interface EditForm {
  display_name: string;
  role: Role;
}

interface ResetForm {
  newPassword: string;
  confirm: string;
}

function roleBadge(role: string) {
  return role === "super_admin" ? (
    <Badge className="bg-secondary text-white text-xs">Super Admin</Badge>
  ) : (
    <Badge variant="outline" className="text-xs">Admin</Badge>
  );
}

export default function Team({ user }: { user: AmandaUser }) {
  const isSuperAdmin = user.role === "super_admin";
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: listAdminUsers,
  });

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>({
    username: "",
    display_name: "",
    password: "",
    role: "admin",
  });
  const [createErr, setCreateErr] = useState<string | null>(null);

  const [editTarget, setEditTarget] = useState<AdminUserRecord | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ display_name: "", role: "admin" });
  const [editErr, setEditErr] = useState<string | null>(null);

  const [resetTarget, setResetTarget] = useState<AdminUserRecord | null>(null);
  const [resetForm, setResetForm] = useState<ResetForm>({ newPassword: "", confirm: "" });
  const [resetErr, setResetErr] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User created successfully" });
      setShowCreate(false);
      setCreateForm({ username: "", display_name: "", password: "", role: "admin" });
      setCreateErr(null);
    },
    onError: (e: Error) => setCreateErr(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateAdminUser>[1] }) =>
      updateAdminUser(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      if ("display_name" in vars.data || "role" in vars.data) {
        toast({ title: "User updated" });
        setEditTarget(null);
        setEditErr(null);
      } else {
        toast({ title: "User updated" });
      }
    },
    onError: (e: Error) => {
      setEditErr(e.message);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const resetMutation = useMutation({
    mutationFn: ({ id, newPassword }: { id: number; newPassword: string }) =>
      resetAdminUserPassword(id, newPassword),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Password reset successfully" });
      setResetTarget(null);
      setResetForm({ newPassword: "", confirm: "" });
      setResetErr(null);
    },
    onError: (e: Error) => setResetErr(e.message),
  });

  function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateErr(null);
    if (createForm.password.length < 8) {
      setCreateErr("Password must be at least 8 characters.");
      return;
    }
    createMutation.mutate(createForm);
  }

  function submitReset(e: React.FormEvent) {
    e.preventDefault();
    setResetErr(null);
    if (resetForm.newPassword.length < 8) {
      setResetErr("Password must be at least 8 characters.");
      return;
    }
    if (resetForm.newPassword !== resetForm.confirm) {
      setResetErr("Passwords don't match.");
      return;
    }
    resetMutation.mutate({ id: resetTarget!.id, newPassword: resetForm.newPassword });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Admin</p>
          <h1 className="text-3xl font-serif font-bold">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSuperAdmin ? "Manage admin accounts." : "View team members."}
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            className="bg-secondary hover:bg-secondary/90 text-white shrink-0"
            onClick={() => setShowCreate(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        )}
      </header>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Username</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Role</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                {isSuperAdmin && (
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const isMe = u.id === user.id;
                return (
                  <tr
                    key={u.id}
                    className={`border-b border-border last:border-0 ${idx % 2 === 1 ? "bg-muted/10" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-semibold">{u.display_name}</span>
                      {isMe && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">(you)</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">@{u.username}</td>
                    <td className="px-5 py-3.5">{roleBadge(u.role)}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {u.active ? (
                        <span className="text-green-600 font-medium text-xs">Active</span>
                      ) : (
                        <span className="text-destructive font-medium text-xs">Deactivated</span>
                      )}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-5 py-3.5 text-right">
                        {isMe ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit name & role"
                              onClick={() => {
                                setEditTarget(u);
                                setEditForm({ display_name: u.display_name, role: u.role as Role });
                                setEditErr(null);
                              }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Reset password"
                              onClick={() => {
                                setResetTarget(u);
                                setResetForm({ newPassword: "", confirm: "" });
                                setResetErr(null);
                              }}
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title={u.active ? "Deactivate user" : "Reactivate user"}
                              onClick={() =>
                                updateMutation.mutate({ id: u.id, data: { active: !u.active } })
                              }
                              disabled={updateMutation.isPending}
                            >
                              {u.active ? (
                                <UserX className="w-3.5 h-3.5 text-destructive" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5 text-green-600" />
                              )}
                            </Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreate} onOpenChange={(v) => { setShowCreate(v); setCreateErr(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Display Name</Label>
              <Input
                placeholder="Jane Smith"
                value={createForm.display_name}
                onChange={(e) => setCreateForm((f) => ({ ...f, display_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input
                placeholder="janesmith"
                value={createForm.username}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))
                }
                required
              />
              <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and underscores only.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Initial Password</Label>
              <Input
                type="password"
                placeholder="Min. 8 characters"
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(v) => setCreateForm((f) => ({ ...f, role: v as Role }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createErr && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                {createErr}
              </div>
            )}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-secondary hover:bg-secondary/90 text-white"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(v) => { if (!v) { setEditTarget(null); setEditErr(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Team Member</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditErr(null);
                if (!editForm.display_name.trim()) {
                  setEditErr("Display name is required.");
                  return;
                }
                updateMutation.mutate({ id: editTarget.id, data: { display_name: editForm.display_name.trim(), role: editForm.role } });
              }}
              className="space-y-4 pt-2"
            >
              <p className="text-sm text-muted-foreground">
                Editing <span className="font-semibold text-foreground">@{editTarget.username}</span>
              </p>
              <div className="space-y-1.5">
                <Label>Display Name</Label>
                <Input
                  value={editForm.display_name}
                  onChange={(e) => setEditForm((f) => ({ ...f, display_name: e.target.value }))}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, role: v as Role }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editErr && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                  {editErr}
                </div>
              )}
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-secondary hover:bg-secondary/90 text-white"
                >
                  {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetTarget} onOpenChange={(v) => { if (!v) setResetTarget(null); setResetErr(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Reset Password</DialogTitle>
          </DialogHeader>
          {resetTarget && (
            <form onSubmit={submitReset} className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Setting a new password for <span className="font-semibold text-foreground">{resetTarget.display_name}</span> (@{resetTarget.username}).
              </p>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={resetForm.newPassword}
                  onChange={(e) => setResetForm((f) => ({ ...f, newPassword: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Repeat password"
                  value={resetForm.confirm}
                  onChange={(e) => setResetForm((f) => ({ ...f, confirm: e.target.value }))}
                  required
                />
              </div>
              {resetErr && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                  {resetErr}
                </div>
              )}
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setResetTarget(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={resetMutation.isPending}
                  className="bg-secondary hover:bg-secondary/90 text-white"
                >
                  {resetMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Reset Password
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
