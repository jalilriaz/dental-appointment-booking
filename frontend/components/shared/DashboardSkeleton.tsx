import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <Skeleton className="h-8 w-[200px] mb-2 bg-slate-800" />
                <Skeleton className="h-4 w-[350px] bg-slate-800/80" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card rounded-xl p-5 border-l-2 border-l-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-[120px] bg-slate-800" />
                                <Skeleton className="h-6 w-[160px] bg-slate-800" />
                                <Skeleton className="h-3 w-[100px] bg-slate-800" />
                            </div>
                            <Skeleton className="size-12 rounded-xl bg-slate-800" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-3">
                        <Skeleton className="size-10 rounded-lg bg-slate-800" />
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-5 w-[80px] bg-slate-800" />
                            <Skeleton className="h-3 w-[100px] bg-slate-800" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card rounded-xl overflow-hidden p-6 space-y-4">
                <Skeleton className="h-6 w-[200px] bg-slate-800" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full bg-slate-800 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}
