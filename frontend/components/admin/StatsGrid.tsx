import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

interface StatsGridProps {
    totalPatients: number;
    appointmentsToday: number;
    totalRevenue: number;
    monthlyGrowth: number;
}

export function StatsGrid({ totalPatients, appointmentsToday, totalRevenue, monthlyGrowth }: StatsGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Revenue</p>
                        <p className="text-2xl font-extrabold text-emerald-600 mt-1">${totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                            <TrendingUpOutlinedIcon className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">+{monthlyGrowth}%</span> from last month
                        </p>
                    </div>
                    <div className="size-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <AttachMoneyOutlinedIcon className="size-6 text-emerald-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 border-l-4 border-l-sky-600 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Appointments Today</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{appointmentsToday}</p>
                        <p className="text-xs text-slate-500 mt-1">Scheduled sessions</p>
                    </div>
                    <div className="size-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                        <CalendarTodayOutlinedIcon className="size-6 text-sky-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 border-l-4 border-l-teal-600 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Patients</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalPatients}</p>
                        <p className="text-xs text-slate-500 mt-1">Active clinical records</p>
                    </div>
                    <div className="size-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                        <PeopleAltOutlinedIcon className="size-6 text-teal-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 border-l-4 border-l-amber-600 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient Retention</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">85%</p>
                        <p className="text-xs text-slate-500 mt-1">High satisfaction</p>
                    </div>
                    <div className="size-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                        <ShowChartOutlinedIcon className="size-6 text-amber-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}
