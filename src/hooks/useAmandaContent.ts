import { useQuery } from "@tanstack/react-query";
import { api, type AmandaContent, type AmandaBlogPost } from "@/lib/api";

const PUBLIC_QUERY_OPTS = {
  staleTime: 60_000,
  refetchOnWindowFocus: false,
} as const;

export function useAmandaContent() {
  return useQuery({
    queryKey: ["amanda", "content"],
    queryFn: () => api<AmandaContent>("/public/content"),
    ...PUBLIC_QUERY_OPTS,
  });
}

export function useAmandaBlogPosts() {
  return useQuery({
    queryKey: ["amanda", "blog-posts"],
    queryFn: () => api<AmandaBlogPost[]>("/public/blog-posts"),
    ...PUBLIC_QUERY_OPTS,
  });
}

export function useAmandaBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ["amanda", "blog-post", slug],
    queryFn: () => api<AmandaBlogPost>(`/public/blog-posts/${slug}`),
    enabled: Boolean(slug),
    ...PUBLIC_QUERY_OPTS,
  });
}

// Convenience: build an <img src> from either a stored image URL or fall back to a public asset.
// - URLs starting with "/api/" or "http" are returned as-is.
// - URLs starting with "/" are prefixed with import.meta.env.BASE_URL.
// - Empty strings use the provided fallback (already-prefixed).
export function resolveImg(stored: string | undefined | null, fallbackPublicPath: string): string {
  if (stored && (stored.startsWith("/api/") || stored.startsWith("http://") || stored.startsWith("https://"))) {
    return stored;
  }
  if (stored && stored.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${stored.replace(/^\//, "")}`;
  }
  if (stored) return stored;
  return `${import.meta.env.BASE_URL}${fallbackPublicPath.replace(/^\//, "")}`;
}

// Convenience getter with fallback for settings.
export function s(settings: Record<string, string> | undefined, key: string, fallback = ""): string {
  return settings?.[key] ?? fallback;
}
