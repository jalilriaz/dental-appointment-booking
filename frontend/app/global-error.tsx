"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Caught by Global Error Boundary:", error);
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="size-20 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
                        <WarningAmberOutlinedIcon className="size-10 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Error</h1>
                    <p className="text-slate-600 text-sm font-medium">
                        A critical system exception occurred while loading the application shell.
                    </p>

                    <div className="pt-4">
                        <Button
                            onClick={() => reset()}
                            className="bg-teal-600 hover:bg-teal-700 text-white border-0 transition-all font-semibold py-2.5 px-6 rounded-xl shadow-xs cursor-pointer active:scale-95 text-xs"
                        >
                            <RefreshOutlinedIcon className="mr-2 size-4" /> Reload Application
                        </Button>
                    </div>

                    {process.env.NODE_ENV === "development" && (
                        <div className="mt-8 text-left bg-white p-4 rounded-xl border border-red-200 shadow-sm max-h-[40vh] overflow-auto">
                            <p className="text-xs font-mono text-red-600 mb-2 font-bold flex items-center justify-between">
                                <span>Developer Info</span>
                                <span className="text-[10px] text-slate-400">Only visible in dev</span>
                            </p>
                            <pre className="text-[11px] text-slate-700 font-mono whitespace-pre-wrap break-all">
                                {error.message}
                                {error.stack && `\n\n${error.stack}`}
                            </pre>
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}
