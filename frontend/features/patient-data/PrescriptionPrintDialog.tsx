"use client";

import PrintOutlined from "@mui/icons-material/PrintOutlined";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatKarachiDate } from "@/lib/format";
import type { ClinicHeaderInfo, PrescriptionRow } from "./types";

interface Props {
    prescription: PrescriptionRow | null;
    patientName: string;
    patientCode: number | null;
    patientPhone: string | null;
    allergies: string[];
    clinicInfo: ClinicHeaderInfo;
    onClose: () => void;
}

export default function PrescriptionPrintDialog({
    prescription,
    patientName,
    patientCode,
    patientPhone,
    allergies,
    clinicInfo,
    onClose,
}: Props) {
    if (!prescription) return null;

    return (
        <Dialog open={Boolean(prescription)} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:border-0">
                <DialogHeader className="print:hidden">
                    <DialogTitle>Printable Prescription Slip</DialogTitle>
                </DialogHeader>

                <div id="rx-print-sheet" className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 text-slate-900">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
                        <div>
                            <h3 className="text-base font-bold text-teal-800">{clinicInfo.clinicName}</h3>
                            {clinicInfo.clinicAddress && <p className="text-[11px] text-slate-500">{clinicInfo.clinicAddress}</p>}
                            {clinicInfo.phone && <p className="text-[11px] text-slate-500">Tel: {clinicInfo.phone}</p>}
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">{prescription.doctorName || clinicInfo.doctorName}</p>
                            {(prescription.doctorPmdc || clinicInfo.doctorPmdc) && (
                                <p className="text-[11px] font-semibold text-teal-700">
                                    PMDC: {prescription.doctorPmdc || clinicInfo.doctorPmdc}
                                </p>
                            )}
                            <p className="text-[11px] text-slate-500 mt-0.5">Date: {formatKarachiDate(prescription.createdAt)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs border border-slate-100">
                        <div><span className="text-slate-500">Patient:</span> <span className="font-semibold">{patientName}</span></div>
                        <div><span className="text-slate-500">MRN:</span> <span className="font-semibold">{patientCode ? `P-${patientCode}` : "—"}</span></div>
                        <div><span className="text-slate-500">Phone:</span> <span className="font-semibold">{patientPhone || "—"}</span></div>
                        {allergies.length > 0 && (
                            <div className="col-span-2 sm:col-span-3 text-rose-700 font-semibold">
                                Recorded allergies: {allergies.join(", ")}
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-lg font-serif font-bold text-teal-700 mb-2">Rx</p>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                            {prescription.entries.map((item, idx) => (
                                <div key={idx} className="px-3 py-2 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                    <div>
                                        <span className="font-bold text-slate-900">{idx + 1}. {item.drug}</span>
                                        <span className="text-slate-600 ml-2">{item.dose}</span>
                                        {item.instructions && <p className="text-[11px] text-slate-500 mt-0.5">{item.instructions}</p>}
                                    </div>
                                    <div className="text-[11px] font-medium text-slate-700 shrink-0">
                                        {item.frequency} · {item.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {prescription.notes && (
                        <div className="text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                            <span className="font-semibold text-slate-700">Clinical advice: </span>
                            <span className="text-slate-600">{prescription.notes}</span>
                        </div>
                    )}

                    <div className="pt-4 border-t border-dashed border-slate-200 flex items-end justify-between text-[11px] text-slate-500">
                        <span>Rx ID: {prescription.id.slice(0, 8)}</span>
                        <div className="text-right">
                            <div className="w-40 border-b border-slate-400 mb-1" />
                            <span>{prescription.doctorName || clinicInfo.doctorName}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="print:hidden gap-2">
                    <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                        Close
                    </button>
                    <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer">
                        <PrintOutlined sx={{ fontSize: 15 }} /> Print slip
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
