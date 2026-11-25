import type { QueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

const AUTH_COOKIE_NAMES = ["session", "refreshToken", "token"];

function expireClientCookies() {
  if (typeof document === "undefined") return;
  for (const name of AUTH_COOKIE_NAMES) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * Signs out from both backend and frontend auth endpoints, clears client
 * caches/storage/cookies, and replaces history to prevent back-navigation.
 */
export async function performLogout(
  queryClient?: QueryClient,
  redirectTo = "/login"
) {
  try {
    await Promise.allSettled([
      fetchApi("/api/auth/logout", { method: "POST" }),
      fetch("/api/auth/logout", { method: "POST", credentials: "include" }),
    ]);
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    queryClient?.clear();

    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
        expireClientCookies();
        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        }
      } catch {
        // Ignore storage/cache restrictions in private browsing modes
      }
      window.location.replace(redirectTo);
    }
  }
}
