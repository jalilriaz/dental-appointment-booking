"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service here (e.g., Sentry)
        console.error("Caught by App Error Boundary:", error)
    }, [error])

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="size-10 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
            <p className="text-slate-400 mb-8 max-w-md">
                We apologize for the inconvenience. Our team has been notified. Please try again or return to the dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={reset}
                    className="btn-brand border-0 transition-premium"
                >
                    <RefreshCcw className="mr-2 size-4" /> Try Again
                </Button>
                <Link href="/">
                    <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-white/[0.04]">
                        <Home className="mr-2 size-4" /> Go to Homepage
                    </Button>
                </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
                <div className="mt-12 text-left max-w-2xl w-full bg-slate-900/50 p-4 rounded-lg border border-red-500/20">
                    <p className="text-xs font-mono text-red-400 mb-2">Developer Information:</p>
                    <pre className="text-[10px] text-slate-400 overflow-x-auto">
                        {error.message}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                </div>
            )}
        </div>
    )
}
