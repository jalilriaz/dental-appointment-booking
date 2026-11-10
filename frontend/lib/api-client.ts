/**
 * Centralized API client for communicating with the standalone Express backend.
 * Uses NEXT_PUBLIC_API_URL (defaults to http://localhost:4000)
 */

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (options.body instanceof FormData) {
        delete defaultHeaders['Content-Type'];
    }

    return fetch(url, {
        ...options,
        headers: defaultHeaders,
        credentials: options.credentials || 'include',
    });
}

