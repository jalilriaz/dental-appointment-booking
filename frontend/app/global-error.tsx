"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw } from "lucide-react"

// global-error must include the HTML and BODY tags
// because it replaces the root layout when an error occurs there.
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Caught by Global Error Boundary:", error)
    }, [error])

    return (
        <html lang="en">
            <body className="bg-[#0f172a] text-slate-200 antialiased min-h-screen flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="size-10 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-white tracking-tight">System Error</h1>
                    <p className="text-slate-400">
                        A critical error occurred while loading the application shell. Our technical team has been notified.
                    </p>

                    <div className="pt-4">
                        <Button
                            onClick={() => reset()}
                            className="bg-teal-500 hover:bg-teal-400 text-white border-0 transition-all font-medium py-2 px-6 rounded-md shadow-[0_0_15px_rgba(20,184,166,0.3)] active:scale-95"
                        >
                            <RefreshCcw className="mr-2 size-4" /> Reload Application
                        </Button>
                    </div>

                    {process.env.NODE_ENV === "development" && (
                        <div className="mt-8 text-left bg-slate-900/80 p-4 rounded-lg border border-red-500/20 max-h-[40vh] overflow-auto">
                            <p className="text-xs font-mono text-red-400 mb-2 font-bold flex items-center justify-between">
                                <span>Developer Info</span>
                                <span className="text-[10px] text-slate-500">Only visible in dev</span>
                            </p>
                            <pre className="text-[11px] text-slate-400 font-mono whitespace-pre-wrap break-all">
                                {error.message}
                                {error.stack && `\n\n${error.stack}`}
                            </pre>
                        </div>
                    )}
                </div>
            </body>
        </html>
    )
}
