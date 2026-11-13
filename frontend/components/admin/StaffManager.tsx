"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlineOutlined,
  MailOutlined,
  PhoneOutlined,
  SecurityOutlined,
  BadgeOutlined,
  LockOutlined,
  PersonOutlineOutlined,
  CheckCircleOutlineOutlined,
  WarningAmberOutlined,
  SupportAgentOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchApi } from "@/lib/api-client";

export interface StaffMember {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: "ADMIN" | "STAFF";
  createdAt?: string | Date;
}

interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "STAFF";
  password?: string;
}

const DEFAULT_FORM: StaffFormData = {
  name: "",
  email: "",
  phone: "",
  role: "STAFF",
  password: "",
};

export default function StaffManager({ initialStaff }: { initialStaff: any[] }) {
  const router = useRouter();
  const [staffList, setStaffList] = useState<StaffMember[]>(
    initialStaff.map((s) => ({
      ...s,
      role: s.role as "ADMIN" | "STAFF",
    }))
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<StaffFormData>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState<StaffMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ──────────────────────────────────────────────────────────────────
  // 1. DIALOG CONTROLS
  // ──────────────────────────────────────────────────────────────────
  const handleOpenDialog = (staff?: StaffMember) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        role: staff.role || "STAFF",
        password: "",
      });
    } else {
      setEditingStaff(null);
      setFormData(DEFAULT_FORM);
    }
    setIsDialogOpen(true);
  };

  // ──────────────────────────────────────────────────────────────────
  // 2. FORM SUBMISSION (ADD / EDIT)
  // ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and Email are required");
      return;
    }

    if (!editingStaff && (!formData.password || formData.password.length < 8)) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const url = editingStaff ? `/api/staff/${editingStaff.id}` : "/api/staff";
      const method = editingStaff ? "PUT" : "POST";

      const payload: Record<string, any> = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        role: formData.role,
      };

      if (formData.password && formData.password.trim().length >= 8) {
        payload.password = formData.password.trim();
      }

      const res = await fetchApi(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save staff account");
      }

      if (editingStaff) {
        setStaffList((prev) =>
          prev.map((s) => (s.id === editingStaff.id ? { ...s, ...data.staff } : s))
        );
        toast.success(`Account for ${formData.name} updated successfully!`);
      } else {
        setStaffList((prev) => [data.staff, ...prev]);
        toast.success(`Staff account for ${formData.name} created!`);
      }

      setIsDialogOpen(false);
      setEditingStaff(null);
      setFormData(DEFAULT_FORM);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save staff member");
    } finally {
      setIsLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────
  // 3. DELETE ACCOUNT
  // ──────────────────────────────────────────────────────────────────
  const confirmDelete = (staff: StaffMember) => {
    const adminCount = staffList.filter((s) => s.role === "ADMIN").length;
    if (staff.role === "ADMIN" && adminCount <= 1) {
      toast.error("Cannot delete the only remaining Administrator account.");
      return;
    }
    setDeleteCandidate(staff);
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);

    try {
      const res = await fetchApi(`/api/staff/${deleteCandidate.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete account");
      }

      setStaffList((prev) => prev.filter((s) => s.id !== deleteCandidate.id));
      toast.success(`${deleteCandidate.name} removed from staff accounts.`);
      setDeleteCandidate(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete staff member");
    } finally {
      setIsDeleting(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────
  // 4. METRICS
  // ──────────────────────────────────────────────────────────────────
  const totalStaff = staffList.length;
  const receptionists = staffList.filter((s) => s.role === "STAFF").length;
  const admins = staffList.filter((s) => s.role === "ADMIN").length;

  return (
    <div className="space-y-8">
      {/* ──────────────────────────────────────────────────────────────────
          1. HEADER & ACTIONS
          ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-2">
            <SecurityOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
            <span>Access & Identity Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Staff & Administrative Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage front-desk receptionists, clinical administrators, and internal credentials.
          </p>
        </div>

        <Button
          onClick={() => handleOpenDialog()}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl h-11 px-5 shadow-xs transition-all active:scale-[0.98] cursor-pointer shrink-0"
        >
          <AddOutlined sx={{ fontSize: 18, mr: 1 }} />
          <span>Add Staff Account</span>
        </Button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          2. KPI SUMMARY METRICS
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accounts */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <BadgeOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {totalStaff} {totalStaff === 1 ? "User" : "Users"}
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
            Internal Authorized Faculty
          </span>
        </div>

        {/* Receptionists */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Reception Staff
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <SupportAgentOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {receptionists} {receptionists === 1 ? "Receptionist" : "Receptionists"}
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
            Front-Desk & Booking Access
          </span>
        </div>

        {/* Administrators */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Administrators
            </span>
            <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <AdminPanelSettingsOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {admins} {admins === 1 ? "Admin" : "Admins"}
          </p>
          <span className="text-[11px] font-semibold text-blue-700 mt-0.5 block">
            Full Clinical & Financial Access
          </span>
        </div>

        {/* Security Standard */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Auth Security
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-700 mt-2">Bcrypt + JWT</p>
          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
            Private Admin Provisioned
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          3. STAFF ACCOUNTS DIRECTORY
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Authorized Team Directory
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Physical clinic staff with credentials to access the clinic operating system.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200">
            {totalStaff} Active Accounts
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {staffList.map((member) => {
            const isAdmin = member.role === "ADMIN";
            return (
              <div
                key={member.id}
                className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/70 transition-colors"
              >
                {/* Profile Details */}
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border ${
                      isAdmin
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-teal-50 text-teal-700 border-teal-200"
                    }`}
                  >
                    {(member.name || "U").charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 truncate">
                        {member.name || "Unnamed Staff"}
                      </h3>
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
                          <AdminPanelSettingsOutlined sx={{ fontSize: 13 }} />
                          <span>Admin (Full Access)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
                          <SupportAgentOutlined sx={{ fontSize: 13 }} />
                          <span>Staff (Receptionist)</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MailOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                        <span className="text-slate-700 font-semibold">{member.email || "No Email"}</span>
                      </span>
                      {member.phone && (
                        <span className="flex items-center gap-1">
                          <PhoneOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                          <span>{member.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenDialog(member)}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 px-3.5 rounded-2xl text-xs font-bold cursor-pointer"
                  >
                    <EditOutlined sx={{ fontSize: 15, mr: 1 }} />
                    <span>Edit</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => confirmDelete(member)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-9 px-3 rounded-2xl text-xs font-bold cursor-pointer"
                    title={`Delete ${member.name}`}
                  >
                    <DeleteOutlineOutlined sx={{ fontSize: 16, mr: 1 }} />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          4. ADD / EDIT DIALOG
          ────────────────────────────────────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl bg-white p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
              {editingStaff ? "Edit Staff Account" : "Add New Staff Account"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              {editingStaff
                ? "Update staff contact details, role, or reset password."
                : "Provision a new internal account for reception or administrative staff."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Full Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                required
                placeholder="e.g. Receptionist Sarah"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-slate-200 text-xs h-10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. sarah@elitedental.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Phone Number</Label>
                <Input
                  placeholder="e.g. +92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Permission Role <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(val: "ADMIN" | "STAFF") =>
                  setFormData({ ...formData, role: val })
                }
              >
                <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10 bg-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl">
                  <SelectItem value="STAFF" className="text-xs cursor-pointer">
                    Staff (Receptionist) — Appointments & Walk-In Desk
                  </SelectItem>
                  <SelectItem value="ADMIN" className="text-xs cursor-pointer">
                    Admin (Doctor / Lead) — Full System Management
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                {editingStaff ? "New Password (Leave blank to keep unchanged)" : "Initial Password *"}
              </Label>
              <Input
                type="password"
                placeholder={editingStaff ? "••••••••" : "Minimum 8 characters"}
                required={!editingStaff}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="rounded-xl border-slate-200 text-xs h-10"
              />
              <span className="text-[11px] text-slate-400 block">
                {editingStaff
                  ? "Enter a new password only if resetting."
                  : "Must be at least 8 characters. The staff member will use this to sign in."}
              </span>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => setIsDialogOpen(false)}
                className="rounded-2xl h-10 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-10 px-5 text-xs font-bold cursor-pointer"
              >
                {isLoading ? "Saving..." : editingStaff ? "Update Account" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────────────
          5. DELETE CONFIRMATION DIALOG
          ────────────────────────────────────────────────────────────────── */}
      <Dialog
        open={!!deleteCandidate}
        onOpenChange={(open) => !open && setDeleteCandidate(null)}
      >
        <DialogContent className="sm:max-w-md rounded-3xl bg-white p-6 sm:p-7">
          <DialogHeader>
            <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <WarningAmberOutlined sx={{ fontSize: 26 }} />
            </div>
            <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
              Delete Staff Account?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Are you sure you want to delete the account for{" "}
              <strong className="text-slate-900 font-bold">{deleteCandidate?.name}</strong> (
              {deleteCandidate?.email})? They will immediately lose access to the reception and admin portals.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteCandidate(null)}
              className="rounded-2xl h-10 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-10 px-5 text-xs font-bold cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
