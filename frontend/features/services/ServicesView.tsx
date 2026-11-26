"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { ConfirmDialog, PageHeader } from "@/components/admin/shared";
import { fetchApi } from "@/lib/api-client";
import ServiceFormDialog from "./ServiceFormDialog";
import ServicesGrid from "./ServicesGrid";
import ServicesTable from "./ServicesTable";
import ServicesToolbar from "./ServicesToolbar";
import { totalRefs, type ServiceItem, type ServiceSort } from "./types";

export default function ServicesView({ initialServices }: { initialServices: ServiceItem[] }) {
    const [services, setServices] = useState<ServiceItem[]>(initialServices);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "HIDDEN">("ALL");
    const [sortBy, setSortBy] = useState<ServiceSort>("name");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<ServiceItem | null>(null);
    const [pendingRemove, setPendingRemove] = useState<ServiceItem | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return services
            .filter((s) => {
                if (category !== "ALL" && s.category !== category) return false;
                if (statusFilter === "ACTIVE" && (!s.isActive || !s.showOnWeb)) return false;
                if (statusFilter === "HIDDEN" && s.isActive && s.showOnWeb) return false;
                if (!q) return true;
                return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
            })
            .sort((a, b) => {
                if (sortBy === "price_asc") return (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price);
                if (sortBy === "price_desc") return (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price);
                if (sortBy === "duration") return a.durationMin - b.durationMin;
                if (sortBy === "bookings") return (b._count?.appointments || 0) - (a._count?.appointments || 0);
                return a.name.localeCompare(b.name);
            });
    }, [services, search, category, statusFilter, sortBy]);

    const patchField = async (item: ServiceItem, patch: Partial<ServiceItem>, label: string) => {
        setBusyId(item.id);
        try {
            const res = await fetchApi(`/api/treatments/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");
            setServices((prev) => prev.map((x) => (x.id === item.id ? data.treatment : x)));
            toast.success(label);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Update failed");
        } finally {
            setBusyId(null);
        }
    };

    const confirmRemove = async () => {
        if (!pendingRemove) return;
        const refs = totalRefs(pendingRemove);
        setBusyId(pendingRemove.id);
        try {
            const url = refs > 0 ? `/api/treatments/${pendingRemove.id}/archive` : `/api/treatments/${pendingRemove.id}`;
            const method = refs > 0 ? "PATCH" : "DELETE";
            const res = await fetchApi(url, { method });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Operation failed");
            setServices((prev) => prev.filter((x) => x.id !== pendingRemove.id));
            toast.success(refs > 0 ? "Service archived (booking history preserved)" : "Service deleted");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to remove service");
        } finally {
            setBusyId(null);
            setPendingRemove(null);
        }
    };

    return (
        <div className="space-y-5">
            <PageHeader
                title="Services & pricing"
                subtitle={`${services.length} clinical procedures configured in PKR`}
                actions={
                    <button
                        type="button"
                        onClick={() => { setEditing(null); setDialogOpen(true); }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                    >
                        <AddOutlined sx={{ fontSize: 16 }} />
                        <span>Add service</span>
                    </button>
                }
            />

            <ServicesToolbar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                category={category}
                onCategoryChange={setCategory}
            />

            {viewMode === "table" ? (
                <ServicesTable
                    services={filtered}
                    busyId={busyId}
                    onEdit={(s) => { setEditing(s); setDialogOpen(true); }}
                    onToggleWeb={(s) => patchField(s, { showOnWeb: !s.showOnWeb }, s.showOnWeb ? "Hidden from website" : "Shown on website")}
                    onToggleActive={(s) => patchField(s, { isActive: !s.isActive }, s.isActive ? "Service deactivated" : "Service activated")}
                    onRequestRemove={setPendingRemove}
                />
            ) : (
                <ServicesGrid services={filtered} busyId={busyId} onEdit={(s) => { setEditing(s); setDialogOpen(true); }} onRequestRemove={setPendingRemove} />
            )}

            <ServiceFormDialog
                open={dialogOpen}
                editing={editing}
                onOpenChange={setDialogOpen}
                onSaved={(item, isNew) => setServices((prev) => (isNew ? [item, ...prev] : prev.map((x) => (x.id === item.id ? item : x))))}
            />

            <ConfirmDialog
                open={Boolean(pendingRemove)}
                onOpenChange={(open) => !open && setPendingRemove(null)}
                title={pendingRemove && totalRefs(pendingRemove) > 0 ? "Archive this service?" : "Delete this service?"}
                description={
                    pendingRemove && totalRefs(pendingRemove) > 0
                        ? `"${pendingRemove.name}" has ${totalRefs(pendingRemove)} linked booking(s) or care plan(s), so permanent deletion is blocked. Archiving hides it from new bookings while preserving all past receipts and records.`
                        : `Permanently delete "${pendingRemove?.name || ""}"? This cannot be undone.`
                }
                confirmLabel={pendingRemove && totalRefs(pendingRemove) > 0 ? "Archive service" : "Delete service"}
                variant="danger"
                loading={Boolean(busyId)}
                onConfirm={confirmRemove}
            />
        </div>
    );
}
