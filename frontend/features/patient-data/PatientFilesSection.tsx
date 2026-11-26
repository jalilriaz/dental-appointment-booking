"use client";

import { useState } from "react";
import { toast } from "sonner";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { ConfirmDialog } from "@/components/admin/shared";
import { formatKarachiDate } from "@/lib/format";
import type { PatientFileRow } from "./types";

interface Props {
    patientId: string;
    isAdmin: boolean;
    initialFiles: PatientFileRow[];
}

export default function PatientFilesSection({ patientId, isAdmin, initialFiles }: Props) {
    const [files, setFiles] = useState<PatientFileRow[]>(initialFiles);
    const [title, setTitle] = useState("");
    const [fileType, setFileType] = useState<"XRAY" | "PHOTO" | "REPORT" | "DOCUMENT">("XRAY");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<PatientFileRow | null>(null);

    if (!isAdmin) {
        return (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                <LockOutlined className="text-slate-400" sx={{ fontSize: 22 }} />
                <p className="text-xs font-semibold text-slate-700">Restricted clinical storage</p>
                <p className="text-xs text-slate-500">Only the clinic doctor/admin can upload, view, or download patient X-rays and diagnostic files.</p>
            </div>
        );
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !title.trim()) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", selectedFile);
            fd.append("patientId", patientId);
            fd.append("title", title.trim());
            fd.append("fileType", fileType);
            const res = await fetch("/api/patient-files", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            setFiles((prev) => [data.file, ...prev]);
            setTitle("");
            setSelectedFile(null);
            toast.success("Encrypted private file uploaded & EXIF metadata stripped");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetch(`/api/patient-files/${deleteTarget.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
            toast.success("File removed from active chart");
        } catch {
            toast.error("Failed to remove file");
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleUpload} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end text-xs">
                <div className="sm:col-span-4">
                    <label className="block font-semibold text-slate-700 mb-1">File title</label>
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. OPG Panoramic X-ray" className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white" />
                </div>
                <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Type</label>
                    <select value={fileType} onChange={(e) => setFileType(e.target.value as PatientFileRow["fileType"])} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white">
                        <option value="XRAY">X-ray</option>
                        <option value="REPORT">Lab / CBCT report</option>
                        <option value="PHOTO">Clinical photo</option>
                        <option value="DOCUMENT">Document</option>
                    </select>
                </div>
                <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">File (JPG, PNG, WEBP, PDF)</label>
                    <input required type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="w-full text-[11px]" />
                </div>
                <div className="sm:col-span-2">
                    <button type="submit" disabled={uploading} className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                        <UploadFileOutlined sx={{ fontSize: 15 }} /> {uploading ? "..." : "Upload"}
                    </button>
                </div>
            </form>

            {files.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No diagnostic files uploaded yet.</p>
            ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
                    {files.map((f) => (
                        <div key={f.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div>
                                <p className="font-semibold text-slate-900">{f.title}</p>
                                <p className="text-[11px] text-slate-500">{f.fileType} · {(f.sizeBytes / 1024).toFixed(0)} KB · {formatKarachiDate(f.createdAt, "medium")}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <a href={`/api/patient-files/${f.id}/download`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700">
                                    <VisibilityOutlined sx={{ fontSize: 14 }} /> View
                                </a>
                                <a href={`/api/patient-files/${f.id}/download?download=1`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 font-semibold">
                                    <DownloadOutlined sx={{ fontSize: 14 }} /> Download
                                </a>
                                <button type="button" onClick={() => setDeleteTarget(f)} aria-label={`Delete ${f.title}`} className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer">
                                    <DeleteOutlineOutlined sx={{ fontSize: 14 }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Remove file?" description={`Archive "${deleteTarget?.title || ""}" from active clinical view?`} confirmLabel="Remove" variant="danger" onConfirm={handleDelete} />
        </div>
    );
}
