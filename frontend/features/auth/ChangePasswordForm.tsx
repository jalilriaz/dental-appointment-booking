"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LockResetOutlined from "@mui/icons-material/LockResetOutlined";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/lib/api-client";

export default function ChangePasswordForm({ userName, forced }: { userName: string; forced: boolean }) {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetchApi("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Password change failed");
            toast.success("Password updated");
            router.push(data.role === "ADMIN" ? "/admin" : "/staff");
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Password change failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                        <LockResetOutlined sx={{ fontSize: 20 }} />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-900">Set your personal password</h1>
                        <p className="text-xs text-slate-500">
                            {forced ? `${userName}, you must change your temporary password before continuing.` : `Update account password for ${userName}.`}
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <Label>Current / temporary password</Label>
                        <Input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div>
                        <Label>New password (min 8 characters)</Label>
                        <Input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                        <Label>Confirm new password</Label>
                        <Input type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button type="submit" disabled={saving} className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                        {saving ? "Saving..." : "Update password & continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
