import { cn } from "@/lib/utils";

interface PremiumLoaderProps {
    text?: string;
    className?: string;
    /** "full" = fixed full-screen overlay (default), "inline" = absolute overlay within nearest relative parent */
    variant?: "full" | "inline";
}

export function PremiumLoader({ text = "Loading...", className, variant = "full" }: PremiumLoaderProps) {
    return (
        <div className={cn(
            "z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300",
            variant === "full"
                ? "fixed inset-0"
                : "absolute inset-0 rounded-xl",
            className
        )}>
            <div className="flex flex-col items-center gap-8">
                {/* Elegant spinner */}
                <div className="relative size-20 flex items-center justify-center">
                    {/* Outer soft glow orbit */}
                    <div className="absolute inset-0 rounded-full border border-teal-500/20 blur-[2px]" />

                    {/* Primary spinning ring */}
                    <div
                        className="absolute inset-0 rounded-full border-t-2 border-r-2 border-teal-400 animate-spin"
                        style={{ animationDuration: '1.2s' }}
                    />

                    {/* Secondary counter-spinning inner ring */}
                    <div
                        className="absolute inset-3 rounded-full border-b-2 border-l-2 border-teal-200/60 animate-spin"
                        style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
                    />

                    {/* Center pulsing core */}
                    <div className="size-3 bg-teal-300 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.8)] animate-pulse" />
                </div>

                {/* Typography */}
                <p className="text-sm font-medium text-teal-50/80 tracking-[0.2em] uppercase animate-pulse">
                    {text}
                </p>
            </div>
        </div>
    );
}
