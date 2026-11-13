"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatPKR } from "@/lib/utils";
import { fetchApi } from "@/lib/api-client";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlineOutlined,
  AutorenewOutlined,
  SearchOutlined,
  AccessTimeOutlined,
  AttachMoneyOutlined,
  WarningAmberOutlined,
  MedicalServicesOutlined,
  LocalOfferOutlined,
  CheckCircleOutlineOutlined,
  LayersOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@mui/icons-material";

import type { Treatment } from "@/lib/types";

export default function TreatmentManager({
  initialTreatments,
}: {
  initialTreatments: Treatment[];
}) {
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [deletingTreatment, setDeletingTreatment] = useState<Treatment | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    durationMin: "30",
    price: "",
    discountedPrice: "",
    description: "",
    instructions: "",
    isActive: true,
    imageUrl: "",
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formPayload = new FormData();
      formPayload.append("file", file);

      const res = await fetchApi("/api/upload", {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      setError(err?.message || "Image upload failed");
      toast.error(err?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  const filtered = treatments.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && t.isActive) ||
      (filterActive === "inactive" && !t.isActive);
    return matchesSearch && matchesFilter;
  });

  const activeCount = treatments.filter((t) => t.isActive).length;
  const inactiveCount = treatments.filter((t) => !t.isActive).length;
  const multiSessionCount = treatments.filter((t) => t.isMultiSession).length;
  const avgDuration = treatments.length
    ? Math.round(
        treatments.reduce((sum, t) => sum + (t.durationMin || 0), 0) / treatments.length
      )
    : 0;

  function openAddDialog() {
    setEditingTreatment(null);
    setFormData({
      name: "",
      durationMin: "30",
      price: "",
      discountedPrice: "",
      description: "",
      instructions: "",
      isActive: true,
      imageUrl: "",
    });
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(t: Treatment) {
    setEditingTreatment(t);
    setFormData({
      name: t.name,
      durationMin: String(t.durationMin),
      price: String(t.price),
      discountedPrice: t.discountedPrice ? String(t.discountedPrice) : "",
      description: t.description || "",
      instructions: t.instructions || "",
      isActive: t.isActive ?? true,
      imageUrl: t.imageUrl || "",
    });
    setError("");
    setDialogOpen(true);
  }

  function openDeleteDialog(t: Treatment) {
    setDeletingTreatment(t);
    setError("");
    setDeleteDialogOpen(true);
  }

  async function handleSave() {
    if (!formData.name.trim() || !formData.price) {
      setError("Name and price are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const isEdit = !!editingTreatment;
      const url = isEdit ? `/api/treatments/${editingTreatment.id}` : "/api/treatments";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetchApi(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          durationMin: formData.durationMin,
          price: formData.price,
          discountedPrice: formData.discountedPrice || null,
          description: formData.description || null,
          instructions: formData.instructions || null,
          isActive: formData.isActive,
          imageUrl: formData.imageUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save treatment");

      if (isEdit) {
        setTreatments((prev) =>
          prev.map((t) => (t.id === editingTreatment.id ? { ...t, ...data.treatment } : t))
        );
        toast.success("Treatment updated successfully");
      } else {
        setTreatments((prev) => [data.treatment, ...prev]);
        toast.success("Treatment added to clinical catalogue");
      }

      setDialogOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to save treatment");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingTreatment) return;
    setDeleting(true);
    setError("");

    try {
      const res = await fetchApi(`/api/treatments/${deletingTreatment.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete treatment");
      }

      setTreatments((prev) => prev.filter((t) => t.id !== deletingTreatment.id));
      toast.success("Treatment removed from catalogue");
      setDeleteDialogOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to delete treatment");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleActive(t: Treatment) {
    setTogglingId(t.id);
    try {
      const res = await fetchApi(`/api/treatments/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !t.isActive }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setTreatments((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, isActive: !item.isActive } : item))
      );
      toast.success(
        t.isActive ? `"${t.name}" marked Inactive` : `"${t.name}" activated for booking`
      );
    } catch {
      toast.error("Failed to toggle treatment status. Please try again.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* ──────────────────────────────────────────────────────────────────
          1. HEADER & ACTIONS
          ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-2">
            <MedicalServicesOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
            <span>Clinical Catalogue & Procedure Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Treatments & Clinical Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage dental procedures, durations, base pricing, and synchronized WhatsApp chatbot instructions.
          </p>
        </div>

        <Button
          onClick={openAddDialog}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl h-11 px-5 shadow-xs transition-all active:scale-[0.98] cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <AddOutlined sx={{ fontSize: 18, mr: 1 }} />
          <span>Add Treatment</span>
        </Button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          2. KPI SUMMARY METRICS
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Catalogue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Catalogue
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <MedicalServicesOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {treatments.length} Procedures
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
            {activeCount} active · {inactiveCount} inactive
          </span>
        </div>

        {/* Active Ratio */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Booking Status
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {activeCount} Live on Web & Bot
          </p>
          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
            {inactiveCount === 0 ? "100% available to book" : `${inactiveCount} hidden from patients`}
          </span>
        </div>

        {/* Average Duration */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Duration
            </span>
            <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <AccessTimeOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            ~{avgDuration} mins
          </p>
          <span className="text-[11px] font-semibold text-blue-700 mt-0.5 block">
            Exact calendar slot reserved
          </span>
        </div>

        {/* Multi-Session Treatments */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Multi-Session Care
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <LayersOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-700 mt-2">
            {multiSessionCount} Treatment Plans
          </p>
          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
            Implants, RCT & Orthodontics
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          3. SEARCH & FILTER BAR
          ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 18 }} />
          <Input
            placeholder="Search by procedure name, keyword, or clinical description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 h-11 focus:border-teal-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterActive(f)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                filterActive === f
                  ? "bg-white text-teal-800 shadow-2xs border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {f} {f === "active" ? `(${activeCount})` : f === "inactive" ? `(${inactiveCount})` : `(${treatments.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          4. TREATMENTS DIRECTORY GRID
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((t) => (
          <div
            key={t.id}
            className={`bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group ${
              !t.isActive ? "opacity-75 bg-slate-50/50" : ""
            }`}
          >
            {/* Card Content */}
            <div className="p-5 sm:p-6 space-y-3.5">
              {/* Header: Icon + Title + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    className={`size-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs ${
                      t.isActive
                        ? "bg-teal-50 text-teal-700 border-teal-200/70"
                        : "bg-slate-100 text-slate-400 border-slate-200"
                    }`}
                  >
                    <MedicalServicesOutlined sx={{ fontSize: 20 }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight truncate group-hover:text-teal-700 transition-colors">
                      {t.name}
                    </h3>
                    <div className="flex items-center flex-wrap gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                        {t.category || "General"}
                      </span>
                      {t.isMultiSession && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                          Multi-Session
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {t.isActive ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    Inactive
                  </span>
                )}
              </div>

              {/* Description */}
              {t.description ? (
                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic font-medium">
                  No procedural description provided.
                </p>
              )}

              {/* Telemetry Metric Strip */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 bg-slate-50/70 rounded-2xl p-3 border border-slate-200/60">
                {/* Duration */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Duration
                  </span>
                  <p className="font-extrabold text-xs text-slate-900 mt-0.5 flex items-center gap-1">
                    <AccessTimeOutlined sx={{ fontSize: 13, color: "#0d9488" }} />
                    <span>{t.durationMin}m</span>
                  </p>
                </div>

                {/* Price */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Price
                  </span>
                  {t.discountedPrice ? (
                    <div className="mt-0.5">
                      <p className="text-[10px] text-slate-400 line-through">
                        {formatPKR(t.price)}
                      </p>
                      <p className="font-black text-xs text-emerald-700 truncate">
                        {formatPKR(t.discountedPrice)}
                      </p>
                    </div>
                  ) : (
                    <p className="font-black text-xs text-teal-800 mt-0.5 truncate">
                      {formatPKR(t.price)}
                    </p>
                  )}
                </div>

                {/* Bookings */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Bookings
                  </span>
                  <p className="font-extrabold text-xs text-slate-900 mt-0.5">
                    {t._count?.appointments || 0} visits
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => openEditDialog(t)}
                className="flex-1 py-3 flex items-center justify-center gap-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50/60 transition-colors cursor-pointer"
              >
                <EditOutlined sx={{ fontSize: 14 }} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => toggleActive(t)}
                disabled={togglingId === t.id}
                className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ${
                  t.isActive
                    ? "text-slate-600 hover:text-amber-700 hover:bg-amber-50/60"
                    : "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/60"
                }`}
              >
                {togglingId === t.id ? (
                  <AutorenewOutlined sx={{ fontSize: 14 }} className="animate-spin text-teal-600" />
                ) : t.isActive ? (
                  <>
                    <CloseOutlined sx={{ fontSize: 14 }} />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <CheckOutlined sx={{ fontSize: 14 }} />
                    <span>Activate</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => openDeleteDialog(t)}
                className="flex-1 py-3 flex items-center justify-center gap-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer"
              >
                <DeleteOutlineOutlined sx={{ fontSize: 14 }} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
          <MedicalServicesOutlined sx={{ fontSize: 44 }} className="text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No treatments found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search
              ? "No procedures match your current search query. Try another keyword."
              : "No procedures registered in catalogue. Click 'Add Treatment' to get started."}
          </p>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          5. ADD / EDIT TREATMENT DIALOG
          ────────────────────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl bg-white p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 text-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
              {editingTreatment ? "Edit Clinical Treatment" : "Add New Clinical Treatment"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              {editingTreatment
                ? "Update procedure duration, base pricing, and chatbot instructions."
                : "Register a dental procedure to the clinic catalogue and booking engine."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <WarningAmberOutlined sx={{ fontSize: 16 }} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Treatment Name */}
            <div className="space-y-1.5">
              <Label htmlFor="treatment-name" className="text-xs font-bold text-slate-700">
                Treatment Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="treatment-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. American Whitening Kit"
                className="rounded-xl border-slate-200 text-xs sm:text-sm h-10"
              />
            </div>

            {/* Duration & Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="durationMin" className="text-xs font-bold text-slate-700">
                  Duration (Minutes) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="durationMin"
                  type="number"
                  min="5"
                  max="480"
                  value={formData.durationMin}
                  onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                  placeholder="60"
                  className="rounded-xl border-slate-200 text-xs sm:text-sm h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-bold text-slate-700">
                  Base Price (PKR) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="22000"
                  className="rounded-xl border-slate-200 text-xs sm:text-sm h-10"
                />
              </div>
            </div>

            {/* Discounted Price */}
            <div className="space-y-1.5">
              <Label htmlFor="discountedPrice" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <LocalOfferOutlined sx={{ fontSize: 14, color: "#059669" }} />
                <span>Discounted Price (PKR)</span>
                <span className="text-[10px] text-slate-400 font-normal ml-1">optional promotion</span>
              </Label>
              <Input
                id="discountedPrice"
                type="number"
                min="0"
                value={formData.discountedPrice}
                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                placeholder="e.g. 18000 (leave empty if none)"
                className="rounded-xl border-slate-200 text-xs sm:text-sm h-10"
              />
              {formData.price &&
                formData.discountedPrice &&
                Number(formData.discountedPrice) < Number(formData.price) && (
                  <p className="text-[11px] font-bold text-emerald-700">
                    💰 {Math.round(((Number(formData.price) - Number(formData.discountedPrice)) / Number(formData.price)) * 100)}% discount applied
                  </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-bold text-slate-700">
                Procedural Description
              </Label>
              <textarea
                id="description"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Clinical description for patients and reception staff..."
                className="w-full rounded-xl border border-slate-200 text-xs sm:text-sm p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 placeholder:text-slate-400"
              />
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <Label htmlFor="instructions" className="text-xs font-bold text-slate-700">
                Post-Treatment Care Instructions
                <span className="text-[10px] text-teal-700 font-normal ml-1.5">
                  (Triggered automatically via WhatsApp care webhook)
                </span>
              </Label>
              <textarea
                id="instructions"
                rows={2}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="e.g. Avoid coffee/tea for 48 hours. Soft diet for 2 days..."
                className="w-full rounded-xl border border-slate-200 text-xs sm:text-sm p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 placeholder:text-slate-400"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {formData.isActive ? "Active for Online & Bot Booking" : "Hidden from Booking Channels"}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {formData.isActive
                    ? "Available to patients on website and WhatsApp assistant."
                    : "Temporarily disabled from public slots."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  formData.isActive ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    formData.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-slate-200 text-slate-700 rounded-2xl h-10 px-4 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl h-10 px-5 text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              {saving ? (
                <>
                  <AutorenewOutlined sx={{ fontSize: 16 }} className="animate-spin mr-1.5" />
                  <span>Saving...</span>
                </>
              ) : editingTreatment ? (
                "Update Treatment"
              ) : (
                "Create Treatment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────────────
          6. DELETE CONFIRMATION DIALOG
          ────────────────────────────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 text-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 text-lg font-black tracking-tight">
              <WarningAmberOutlined sx={{ fontSize: 20 }} />
              <span>Delete Clinical Treatment</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Are you sure you want to remove{" "}
              <strong className="text-slate-900 font-extrabold">{deletingTreatment?.name}</strong>{" "}
              from the active clinical catalogue? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <WarningAmberOutlined sx={{ fontSize: 16 }} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {(deletingTreatment?._count?.appointments || 0) > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-medium text-amber-800">
              ⚠️ This treatment has{" "}
              <strong className="font-extrabold">{deletingTreatment?._count?.appointments}</strong>{" "}
              recorded appointment(s). Consider deactivating instead of permanent deletion.
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-slate-200 text-slate-700 rounded-2xl h-10 px-4 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl h-10 px-5 text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              {deleting ? (
                <>
                  <AutorenewOutlined sx={{ fontSize: 16 }} className="animate-spin mr-1.5" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete Treatment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
