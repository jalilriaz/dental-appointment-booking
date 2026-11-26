const SEARCH_KEY = "clinic_pending_appt_search";
const SEARCH_EVENT = "appointments-search-updated";

export function setPendingAppointmentSearch(term: string) {
    if (typeof window === "undefined") return;
    const trimmed = term.trim();
    if (!trimmed) return;
    window.sessionStorage.setItem(SEARCH_KEY, trimmed);
    window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: trimmed }));
}

export function consumePendingAppointmentSearch(): string {
    if (typeof window === "undefined") return "";
    const value = window.sessionStorage.getItem(SEARCH_KEY) || "";
    if (value) {
        window.sessionStorage.removeItem(SEARCH_KEY);
    }
    return value;
}

export function subscribeAppointmentSearch(handler: (term: string) => void): () => void {
    if (typeof window === "undefined") return () => {};
    const listener = (event: Event) => {
        const customEvent = event as CustomEvent<string>;
        if (typeof customEvent.detail === "string" && customEvent.detail.trim()) {
            window.sessionStorage.removeItem(SEARCH_KEY);
            handler(customEvent.detail);
        }
    };
    window.addEventListener(SEARCH_EVENT, listener);
    return () => window.removeEventListener(SEARCH_EVENT, listener);
}
