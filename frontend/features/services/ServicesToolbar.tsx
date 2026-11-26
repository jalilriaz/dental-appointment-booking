"use client";

import TableRowsOutlined from "@mui/icons-material/TableRowsOutlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import { FilterBar, SearchInput } from "@/components/admin/shared";
import { SERVICE_CATEGORIES, type ServiceSort } from "./types";

interface ServicesToolbarProps {
    search: string;
    onSearchChange: (v: string) => void;
    statusFilter: "ALL" | "ACTIVE" | "HIDDEN";
    onStatusFilterChange: (v: "ALL" | "ACTIVE" | "HIDDEN") => void;
    sortBy: ServiceSort;
    onSortChange: (v: ServiceSort) => void;
    viewMode: "table" | "grid";
    onViewModeChange: (v: "table" | "grid") => void;
    category: string;
    onCategoryChange: (v: string) => void;
}

export default function ServicesToolbar(p: ServicesToolbarProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <SearchInput value={p.search} onChange={p.onSearchChange} placeholder="Search service or category..." className="sm:w-72" />
                <div className="flex flex-wrap items-center gap-2">
                    <select value={p.statusFilter} onChange={(e) => p.onStatusFilterChange(e.target.value as "ALL" | "ACTIVE" | "HIDDEN")} aria-label="Filter visibility" className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
                        <option value="ALL">All visibility</option>
                        <option value="ACTIVE">Public &amp; active</option>
                        <option value="HIDDEN">Hidden or inactive</option>
                    </select>
                    <select value={p.sortBy} onChange={(e) => p.onSortChange(e.target.value as ServiceSort)} aria-label="Sort services" className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
                        <option value="name">Sort: Name</option>
                        <option value="price_asc">Fee: Low to high</option>
                        <option value="price_desc">Fee: High to low</option>
                        <option value="duration">Shortest duration</option>
                        <option value="bookings">Most booked</option>
                    </select>
                    <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50">
                        <button type="button" onClick={() => p.onViewModeChange("table")} aria-label="Table view" className={`p-1.5 rounded-lg cursor-pointer ${p.viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}><TableRowsOutlined sx={{ fontSize: 16 }} /></button>
                        <button type="button" onClick={() => p.onViewModeChange("grid")} aria-label="Grid view" className={`p-1.5 rounded-lg cursor-pointer ${p.viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}><GridViewOutlined sx={{ fontSize: 16 }} /></button>
                    </div>
                </div>
            </div>
            <FilterBar value={p.category} onChange={p.onCategoryChange} options={[{ value: "ALL", label: "All categories" }, ...SERVICE_CATEGORIES.map((c) => ({ value: c, label: c }))]} />
        </div>
    );
}
