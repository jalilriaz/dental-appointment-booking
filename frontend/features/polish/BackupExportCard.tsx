"use client";

import CloudDownloadOutlined from "@mui/icons-material/CloudDownloadOutlined";

export default function BackupExportCard() {
    return (
        <section id="backup-export" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900">Clinic backup &amp; full data export</h2>
                <p className="text-xs text-slate-500">
                    Download a structured JSON backup of patients, appointments, treatments, payments, expenses, closings, lab orders, and waitlist (credentials excluded; logged in AuditLog).
                </p>
            </div>
            <a
                href="/api/backup/export"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
            >
                <CloudDownloadOutlined sx={{ fontSize: 17 }} />
                <span>Download JSON backup</span>
            </a>
        </section>
    );
}
