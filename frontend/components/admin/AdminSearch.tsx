"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, User, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SearchResult {
    id: string;
    title: string;
    subtitle: string;
    type: "user" | "appointment";
    url: string;
}

export default function AdminSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Debounce the query to avoid firing too many API calls
    // Implementing simple debounce logic here without extra hook file for now to keep it contained
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                try {
                    const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setResults(data.results || []);
                        setShowResults(true);
                    }
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative hidden sm:block">
            <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-2 rounded-lg border border-white/10 w-64 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500/50 transition-all">
                {loading ? <Loader2 className="size-4 animate-spin text-teal-400" /> : <Search className="size-4 text-slate-400" />}
                <input
                    type="text"
                    placeholder="Search patients, staff..."
                    className="bg-transparent text-sm text-white outline-none w-full placeholder:text-slate-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length >= 2) setShowResults(true);
                    }}
                />
            </div>

            {/* Results Dropdown */}
            {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 rounded-lg border border-white/[0.08] shadow-2xl py-2 z-50 max-h-[300px] overflow-y-auto">
                    {results.length > 0 ? (
                        <ul>
                            {results.map((result) => (
                                <li key={`${result.type}-${result.id}`}>
                                    <Link
                                        href={result.url}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-premium"
                                        onClick={() => setShowResults(false)}
                                    >
                                        <div className={cn(
                                            "size-8 rounded-full flex items-center justify-center shrink-0",
                                            result.type === 'user' ? "bg-blue-500/15 text-blue-400" : "bg-teal-500/15 text-teal-400"
                                        )}>
                                            {result.type === 'user' ? <User className="size-4" /> : <Calendar className="size-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{result.title}</p>
                                            <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-center text-sm text-slate-400">
                            No results found for &quot;{query}&quot;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
