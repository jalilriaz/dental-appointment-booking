"use client";

import { useState } from "react";
import { toast } from "sonner";
import AddOutlined from "@mui/icons-material/AddOutlined";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LockResetOutlined from "@mui/icons-material/LockResetOutlined";
import PersonOffOutlined from "@mui/icons-material/PersonOffOutlined";
import PersonAddAlt1Outlined from "@mui/icons-material/PersonAddAlt1Outlined";
import { ConfirmDialog, PageHeader, StatCard, StatusBadge } from "@/components/admin/shared";
import { formatKarachiDate } from "@/lib/format";
import StaffFormDialog from "./StaffFormDialog";
import TempPasswordDialog from "./TempPasswordDialog";
import type { StaffAccountRow } from "./types";

export default function StaffAccountsPanel({ initialStaff }: { initialStaff: StaffAccountRow[] }) {
    const [list, setList] = useState<StaffAccountRow[]>(initialStaff);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<StaffAccountRow | null>(null);
    const [toggleTarget, setToggleTarget] = useState<StaffAccountRow | null>(null);
    const [resetTarget, setResetTarget] = useState<StaffAccountRow | null>(null);
    const [tempPassResult, setTempPassResult] = useState<{ staffName: string; tempPassword: string } | null>(null);
    const [busy, setBusy] = useState(false);

    const activeCount = list.filter((s) => s.isActive).length;
    const adminCount = list.filter((s) => s.isActive && s.role === "ADMIN").length;

    const handleToggleActive = async () => {
        if (!toggleTarget) return;
        setBusy(true);
        try {
            const res = await fetch(`/api/staff-accounts/${toggleTarget.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !toggleTarget.isActive }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update account status");
            setList((prev) => prev.map((s) => (s.id === toggleTarget.id ? data.staff : s)));
            toast.success(data.staff.isActive ? "Account reactivated" : "Account deactivated and sessions invalidated");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update account status");
        } finally {
            setBusy(false);
            setToggleTarget(null);
        }
    };

    const handleResetPassword = async () => {
        if (!resetTarget) return;
        setBusy(true);
        try {
            const res = await fetch(`/api/staff-accounts/${resetTarget.id}/reset-password`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Password reset failed");
            setList((prev) => prev.map((s) => (s.id === resetTarget.id ? { ...s, mustChangePassword: true } : s)));
            setTempPassResult(data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Password reset failed");
        } finally {
            setBusy(false);
            setResetTarget(null);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Staff accounts"
                subtitle="Manage access, deactivate accounts safely with immediate session revocation, and reset passwords."
                actions={
                    <button type="button" onClick={() => { setEditing(null); setFormOpen(true); }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer">
                        <AddOutlined sx={{ fontSize: 16 }} /> Add staff account
                    </button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Active accounts" value={activeCount} icon={<BadgeOutlined sx={{ fontSize: 18 }} />} iconTone="teal" />
                <StatCard label="Active administrators" value={adminCount} icon={<PersonAddAlt1Outlined sx={{ fontSize: 18 }} />} iconTone="sky" />
                <StatCard label="Deactivated accounts" value={list.length - activeCount} icon={<PersonOffOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <tr>
                            <th className="px-4 py-3">Staff member</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Added</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {list.map((s) => (
                            <tr key={s.id} className={!s.isActive ? "bg-slate-50/70 text-slate-500" : "hover:bg-slate-50/60"}>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-900">{s.name}</p>
                                    <p className="text-[11px] text-slate-500">{s.email}{s.phone ? ` · ${s.phone}` : ""}</p>
                                    {s.mustChangePassword && <span className="text-[10px] font-semibold text-amber-700">Temp password active — change required on login</span>}
                                </td>
                                <td className="px-4 py-3 font-semibold">{s.role === "ADMIN" ? "Admin / Doctor" : "Staff"}</td>
                                <td className="px-4 py-3"><StatusBadge status={s.isActive ? "ACTIVE" : "DEACTIVATED"} /></td>
                                <td className="px-4 py-3 text-slate-500">{formatKarachiDate(s.createdAt, "short")}</td>
                                <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                                    <button type="button" onClick={() => { setEditing(s); setFormOpen(true); }} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer">
                                        <EditOutlined sx={{ fontSize: 14 }} /> Edit
                                    </button>
                                    <button type="button" onClick={() => setResetTarget(s)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer">
                                        <LockResetOutlined sx={{ fontSize: 14 }} /> Reset password
                                    </button>
                                    <button type="button" onClick={() => setToggleTarget(s)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${s.isActive ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "border-teal-200 text-teal-700 hover:bg-teal-50"}`}>
                                        {s.isActive ? "Deactivate" : "Reactivate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <StaffFormDialog open={formOpen} editing={editing} onOpenChange={setFormOpen} onSaved={(row, created) => setList((prev) => (created ? [row, ...prev] : prev.map((x) => (x.id === row.id ? row : x))))} />
            <TempPasswordDialog result={tempPassResult} onClose={() => setTempPassResult(null)} />

            <ConfirmDialog
                open={Boolean(toggleTarget)}
                onOpenChange={(v) => { if (!v) setToggleTarget(null); }}
                title={toggleTarget?.isActive ? `Deactivate ${toggleTarget.name}?` : `Reactivate ${toggleTarget?.name}?`}
                description={toggleTarget?.isActive ? "Their active sessions will be invalidated immediately and they will be blocked from signing in." : "This restores account access with their existing role."}
                confirmLabel={toggleTarget?.isActive ? "Deactivate" : "Reactivate"}
                variant={toggleTarget?.isActive ? "danger" : "primary"}
                loading={busy}
                onConfirm={handleToggleActive}
            />
            <ConfirmDialog
                open={Boolean(resetTarget)}
                onOpenChange={(v) => { if (!v) setResetTarget(null); }}
                title={`Reset password for ${resetTarget?.name}?`}
                description="Generates a one-time temporary password shown once, invalidates active sessions, and requires a password change on next login."
                confirmLabel="Generate temporary password"
                variant="primary"
                loading={busy}
                onConfirm={handleResetPassword}
            />
        </div>
    );
}
