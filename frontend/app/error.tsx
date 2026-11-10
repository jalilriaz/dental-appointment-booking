"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import Link from "next/link";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service here (e.g., Sentry)
        console.error("Caught by App Error Boundary:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 bg-slate-50">
            <div className="size-20 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mb-6 shadow-xs">
                <WarningAmberOutlinedIcon className="size-10 text-red-600" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 mb-8 max-w-md font-medium text-sm">
                We apologize for the inconvenience. Our clinical system has logged this incident. Please try again or return to the home page.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={reset}
                    className="btn-brand border-0 transition-premium cursor-pointer text-xs font-semibold px-6"
                >
                    <RefreshOutlinedIcon className="mr-2 size-4" /> Try Again
                </Button>
                <Link href="/">
                    <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer text-xs font-semibold px-6">
                        <HomeOutlinedIcon className="mr-2 size-4" /> Go to Homepage
                    </Button>
                </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
                <div className="mt-12 text-left max-w-2xl w-full bg-white p-4 rounded-xl border border-red-200 shadow-sm">
                    <p className="text-xs font-mono font-bold text-red-600 mb-2">Developer Information:</p>
                    <pre className="text-[11px] text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono">
                        {error.message}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                </div>
            )}
        </div>
    );
}
