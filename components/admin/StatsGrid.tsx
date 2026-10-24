import { Users, Calendar, DollarSign, Activity, TrendingUp } from "lucide-react";

interface StatsGridProps {
    totalPatients: number;
    appointmentsToday: number;
    totalRevenue: number;
    monthlyGrowth: number;
}

export function StatsGrid({ totalPatients, appointmentsToday, totalRevenue, monthlyGrowth }: StatsGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="glass-card rounded-xl p-5 border-l-2 border-l-emerald-500 hover:scale-[1.02] hover:border-teal-500/50 transition-premium animate-fade-in-up opacity-0 stagger-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total Revenue</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">${totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">+{monthlyGrowth}%</span> from last month
                        </p>
                    </div>
                    <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <DollarSign className="size-6 text-emerald-400" />
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-xl p-5 border-l-2 border-l-blue-400 hover:scale-[1.02] hover:border-blue-400/50 transition-premium animate-fade-in-up opacity-0 stagger-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Appointments Today</p>
                        <p className="text-2xl font-bold text-white mt-1">{appointmentsToday}</p>
                        <p className="text-xs text-slate-500 mt-1">Busy schedule</p>
                    </div>
                    <div className="size-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
                        <Calendar className="size-6 text-blue-400" />
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-xl p-5 border-l-2 border-l-purple-400 hover:scale-[1.02] hover:border-purple-400/50 transition-premium animate-fade-in-up opacity-0 stagger-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total Patients</p>
                        <p className="text-2xl font-bold text-white mt-1">{totalPatients}</p>
                        <p className="text-xs text-slate-500 mt-1">Active records</p>
                    </div>
                    <div className="size-12 rounded-xl bg-purple-400/10 flex items-center justify-center">
                        <Users className="size-6 text-purple-400" />
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-xl p-5 border-l-2 border-l-orange-400 hover:scale-[1.02] hover:border-orange-400/50 transition-premium animate-fade-in-up opacity-0 stagger-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Patient Retention</p>
                        <p className="text-2xl font-bold text-white mt-1">85%</p>
                        <p className="text-xs text-slate-500 mt-1">Top tier</p>
                    </div>
                    <div className="size-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                        <Activity className="size-6 text-orange-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
