// Lightweight typed API wrapper for the Amanda site.
// All endpoints are namespaced under /api/amanda on the shared api-server.

const API_BASE = "/api/amanda";

export const AMANDA_ADMIN_TOKEN_KEY = "amanda_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AMANDA_ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AMANDA_ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AMANDA_ADMIN_TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth) {
    const tok = getAdminToken();
    if (tok) headers.Authorization = `Bearer ${tok}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    credentials: "include",
  });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = (data && typeof data === "object" && "error" in data && typeof data.error === "string") ? data.error : `HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }
  return data as T;
}

// ---- Public types
export interface AmandaStat { id: number; label: string; value: string; sort_order: number; }
export interface AmandaLoanProgram {
  id: number; title: string; short_desc: string; long_desc: string; who: string;
  highlights: string[]; sort_order: number;
}
export interface AmandaTestimonial {
  id: number; text: string; author: string; location: string; rating: number; sort_order: number;
}
export interface AmandaBlogPost {
  id: number; slug: string; title: string; excerpt: string; cover_image: string;
  body_markdown: string; author: string; tags: string[]; published: boolean;
  published_at: string | null; created_at: string; updated_at: string;
}
export interface AmandaContent {
  settings: Record<string, string>;
  stats: AmandaStat[];
  loanPrograms: AmandaLoanProgram[];
  testimonials: AmandaTestimonial[];
}

// ---- Admin auth
export interface AmandaUser { id: number; username: string; displayName: string; role: string; }
export interface LoginResponse { ok: true; token: string; user: AmandaUser; }

export async function loginAdmin(username: string, password: string): Promise<LoginResponse> {
  return api("/auth/login", { method: "POST", body: { username, password } });
}
export async function getMe(): Promise<{ authenticated: true; user: AmandaUser }> {
  return api("/auth/me", { auth: true });
}
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ ok: true }> {
  return api("/auth/change-password", { method: "POST", body: { currentPassword, newPassword }, auth: true });
}

// ---- Contact submissions
export interface AmandaContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  loan_type: string;
  message: string;
  read: boolean;
  archived: boolean;
  ip: string;
  created_at: string;
}

// ---- Admin user management
export interface AdminUserRecord {
  id: number;
  username: string;
  display_name: string;
  role: string;
  active: boolean;
  created_at: string;
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  return api("/admin/users", { auth: true });
}

export async function createAdminUser(data: {
  username: string;
  display_name: string;
  password: string;
  role: "admin" | "super_admin";
}): Promise<AdminUserRecord> {
  return api("/admin/users", { method: "POST", body: data, auth: true });
}

export async function updateAdminUser(
  id: number,
  data: { display_name?: string; role?: "admin" | "super_admin"; active?: boolean },
): Promise<AdminUserRecord> {
  return api(`/admin/users/${id}`, { method: "PATCH", body: data, auth: true });
}

export async function resetAdminUserPassword(id: number, newPassword: string): Promise<{ ok: true }> {
  return api(`/admin/users/${id}/reset-password`, { method: "POST", body: { newPassword }, auth: true });
}

// ---- Inbox unread count
export async function getUnreadCount(): Promise<{ count: number }> {
  return api("/admin/contact-submissions/unread-count", { auth: true });
}

// ---- Changelog
export interface ChangelogEntry {
  id: number;
  action: string;
  entity: string;
  entity_id: string | null;
  label: string;
  before_json: unknown;
  after_json: unknown;
  changed_by: string;
  created_at: string;
}
export async function listChangelog(): Promise<ChangelogEntry[]> {
  return api("/admin/changelog", { auth: true });
}
export async function revertChangelog(id: number): Promise<{ ok: true }> {
  return api(`/admin/changelog/${id}/revert`, { method: "POST", auth: true });
}

// ---- Admin image upload
export interface UploadUrlResponse { uploadURL: string; objectPath: string; publicUrl: string; }
export async function requestUploadUrl(name: string, size: number, contentType: string): Promise<UploadUrlResponse> {
  return api("/admin/upload-image", { method: "POST", body: { name, size, contentType }, auth: true });
}
export async function uploadImage(file: File): Promise<string> {
  const { uploadURL, publicUrl } = await requestUploadUrl(file.name, file.size, file.type);
  const put = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  if (!put.ok) throw new Error(`Upload failed (${put.status})`);
  return publicUrl;
}
