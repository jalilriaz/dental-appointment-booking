"use client";

import { useState } from "react";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import LockResetOutlined from "@mui/icons-material/LockResetOutlined";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function TempPasswordDialog({
    result,
    onClose,
}: {
    result: { staffName: string; tempPassword: string } | null;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);

    if (!result) return null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(result.tempPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    return (
        <Dialog open={Boolean(result)} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <LockResetOutlined className="text-teal-700" sx={{ fontSize: 20 }} />
                        Temporary password generated
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-xs text-slate-600">
                    <p>
                        Share this one-time password securely in person with <strong className="text-slate-900">{result.staffName}</strong>.
                        It will not be shown again, logged, or sent over email.
                    </p>
                    <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <code className="font-mono text-sm font-bold text-slate-900 tracking-wide select-all">
                            {result.tempPassword}
                        </code>
                        <button
                            type="button"
                            onClick={handleCopy}
                            aria-label="Copy temporary password"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                            {copied ? <CheckOutlined sx={{ fontSize: 14 }} className="text-emerald-600" /> : <ContentCopyOutlined sx={{ fontSize: 14 }} />}
                            <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                    </div>
                    <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        All existing sessions for this account were invalidated. The user will be required to choose a new personal password on next login.
                    </p>
                </div>
                <DialogFooter>
                    <button type="button" onClick={onClose} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer">
                        Done
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
