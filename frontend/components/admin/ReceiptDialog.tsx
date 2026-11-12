"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { formatPKR } from "@/lib/utils";

export interface ReceiptData {
    receiptNumber?: string;
    clinicName?: string;
    doctorName?: string;
    operatory?: string;
    patientName: string;
    patientPhone?: string;
    patientId?: string;
    treatmentName: string;
    appointmentDate: string;
    appointmentTime?: string;
    treatmentPrice: number;
    discount: number;
    amountPaid: number;
    remainingBalance?: number;
    paymentMethod?: string;
    sessionNumber?: number | null;
    totalSessions?: number | null;
}

export default function ReceiptDialog({
    open,
    onOpenChange,
    data,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: ReceiptData | null;
}) {
    const receiptRef = useRef<HTMLDivElement>(null);

    if (!data) return null;

    const netTotal = Math.max(0, data.treatmentPrice - (data.discount || 0));
    const amountPaid = typeof data.amountPaid === "number" ? Math.max(0, data.amountPaid) : 0;
    const remainingBalance = typeof data.remainingBalance === "number"
        ? Math.max(0, data.remainingBalance)
        : Math.max(0, netTotal - amountPaid);
    const isFullyPaid = remainingBalance <= 0 && (amountPaid > 0 || netTotal === 0);
    const isPartiallyPaid = remainingBalance > 0 && amountPaid > 0;
    const isUnpaid = amountPaid === 0 && netTotal > 0;
    const receiptNum = data.receiptNumber || `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    function handlePrint() {
        const receiptData = data!;
        const origin = typeof window !== "undefined" ? window.location.origin : "";

        const printWindow = window.open("", "_blank", "width=520,height=750");
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${receiptData.patientName} (${receiptNum})</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        padding: 24px;
                        color: #0f172a;
                        background: #fff;
                        max-width: 480px;
                        margin: 0 auto;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    .header-box {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        padding-bottom: 14px;
                        border-bottom: 2px dashed #cbd5e1;
                        margin-bottom: 14px;
                    }
                    .logo-img {
                        width: 58px;
                        height: 58px;
                        border-radius: 12px;
                        object-fit: contain;
                    }
                    .clinic-title {
                        font-size: 15px;
                        font-weight: 900;
                        color: #0b1528;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .clinic-sub {
                        font-size: 11px;
                        font-weight: 700;
                        color: #0d9488;
                        margin-top: 2px;
                    }
                    .clinic-meta {
                        font-size: 9.5px;
                        color: #64748b;
                        margin-top: 3px;
                        line-height: 1.3;
                    }
                    .meta-bar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: #f1f5f9;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 7px 10px;
                        font-size: 10.5px;
                        margin-bottom: 12px;
                    }
                    .meta-bar strong { color: #0f172a; font-weight: 800; }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 14px;
                        background: #fafafa;
                    }
                    .info-label {
                        font-size: 9px;
                        text-transform: uppercase;
                        letter-spacing: 0.8px;
                        color: #94a3b8;
                        font-weight: 800;
                    }
                    .info-val {
                        font-size: 12px;
                        font-weight: 800;
                        color: #0f172a;
                        margin-top: 1px;
                    }
                    .info-sub {
                        font-size: 10px;
                        color: #64748b;
                        font-weight: 600;
                    }
                    .bill-table {
                        width: 100%;
                        border-collapse: collapse;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        overflow: hidden;
                        margin-bottom: 12px;
                    }
                    .bill-table th {
                        background: #f8fafc;
                        text-align: left;
                        font-size: 9.5px;
                        text-transform: uppercase;
                        letter-spacing: 0.6px;
                        color: #64748b;
                        font-weight: 800;
                        padding: 8px 10px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .bill-table td {
                        padding: 8px 10px;
                        border-bottom: 1px solid #f1f5f9;
                        font-size: 11.5px;
                    }
                    .bill-table .total-row td {
                        font-weight: 800;
                        background: #f8fafc;
                        border-top: 1px solid #cbd5e1;
                        font-size: 12px;
                    }
                    .bill-table .paid-row td {
                        font-weight: 900;
                        background: #f0fdf4;
                        color: #166534;
                        font-size: 12px;
                    }
                    .payment-method {
                        background: #f0fdfa;
                        border: 1px solid #ccfbf1;
                        border-radius: 8px;
                        padding: 8px 10px;
                        display: flex;
                        justify-content: space-between;
                        font-size: 10.5px;
                        font-weight: 700;
                        color: #134e4a;
                        margin-bottom: 14px;
                    }
                    .footer-box {
                        text-align: center;
                        padding-top: 12px;
                        border-top: 2px dashed #cbd5e1;
                        font-size: 9.5px;
                        color: #64748b;
                        line-height: 1.4;
                    }
                    .footer-box strong { color: #0f172a; }
                    @media print {
                        body { padding: 8px; }
                        @page { margin: 8mm; size: auto; }
                    }
                </style>
            </head>
            <body>
                <div class="header-box">
                    <img src="${origin}/logo.svg" alt="Elite Dental Logo" class="logo-img" onerror="this.style.display='none'" />
                    <div>
                        <div class="clinic-title">${receiptData.clinicName || "Elite Dental & Aesthetic Centre"}</div>
                        <div class="clinic-sub">Clinical Suite · Implantology &amp; Aesthetics</div>
                        <div class="clinic-meta">
                            Doctors Plaza, 1st Floor, Office #6, 6 Markaz Rd (Next to IDC), G-8 Markaz, Islamabad<br/>
                            Tel: +92 314 5475528 · WhatsApp: +92 331 2233447 · PMDC Reg: #38942-D
                        </div>
                    </div>
                </div>

                <div class="meta-bar">
                    <div>Receipt: <strong>#${receiptNum}</strong></div>
                    <div>Status: <strong>${
                        isFullyPaid
                            ? '<span style="color:#166534; background:#f0fdf4; padding:2px 8px; border-radius:999px; border:1px solid #bbf7d0;">✔ PAID IN FULL</span>'
                            : isPartiallyPaid
                            ? `<span style="color:#92400e; background:#fffbeb; padding:2px 8px; border-radius:999px; border:1px solid #fde68a;">⚠️ PARTIALLY PAID · DUE ${formatPKR(remainingBalance)}</span>`
                            : `<span style="color:#be123c; background:#fff1f2; padding:2px 8px; border-radius:999px; border:1px solid #fecdd3;">⚠️ UNPAID · DUE ${formatPKR(remainingBalance)}</span>`
                    }</strong></div>
                    <div>Date: <strong>${receiptData.appointmentDate} ${receiptData.appointmentTime ? `· ${receiptData.appointmentTime}` : ""}</strong></div>
                </div>

                <div class="info-grid">
                    <div>
                        <div class="info-label">Patient Details</div>
                        <div class="info-val">${receiptData.patientName}</div>
                        <div class="info-sub">${receiptData.patientPhone || "Registered Patient"}</div>
                    </div>
                    <div>
                        <div class="info-label">Attending Surgeon</div>
                        <div class="info-val">${receiptData.doctorName || "Dr. Sheriyaar"}</div>
                        <div class="info-sub">${receiptData.operatory || "Chair 1 · Surgical Suite"}</div>
                    </div>
                </div>

                <table class="bill-table">
                    <thead>
                        <tr>
                            <th>Procedure / Service</th>
                            <th style="text-align: right;">Amount (PKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>${receiptData.treatmentName}</strong>
                                ${receiptData.sessionNumber ? `<div style="font-size:9.5px; color:#0d9488; font-weight:700;">Session ${receiptData.sessionNumber} ${receiptData.totalSessions ? `of ${receiptData.totalSessions}` : ""}</div>` : ""}
                            </td>
                            <td style="text-align: right; font-weight: 700;">${formatPKR(receiptData.treatmentPrice)}</td>
                        </tr>
                        ${receiptData.discount > 0 ? `
                        <tr style="color: #dc2626;">
                            <td>Promotional Discount</td>
                            <td style="text-align: right; font-weight: 700;">- ${formatPKR(receiptData.discount)}</td>
                        </tr>
                        ` : ""}
                        <tr class="total-row">
                            <td>Net Total</td>
                            <td style="text-align: right;">${formatPKR(netTotal)}</td>
                        </tr>
                        <tr class="paid-row">
                            <td>Amount Paid (${isFullyPaid ? "Full Settlement" : "Partial Payment"})</td>
                            <td style="text-align: right;">${formatPKR(amountPaid)}</td>
                        </tr>
                        ${remainingBalance > 0 ? `
                        <tr style="background:#fff1f2; color:#9f1239; border-top:2px solid #fda4af;">
                            <td style="padding: 10px;">
                                <div style="font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:0.4px; color:#9f1239;">Remaining Balance Due</div>
                                <div style="font-size:9.5px; color:#be123c; font-weight:600; margin-top:2px;">Payable upon next clinical visit / installment</div>
                            </td>
                            <td style="text-align: right; font-size:13px; font-weight:900; color:#9f1239; padding: 10px;">
                                ${formatPKR(remainingBalance)}
                                <div style="font-size:9px; color:#be123c; font-weight:700; text-transform:uppercase;">Outstanding</div>
                            </td>
                        </tr>
                        ` : `
                        <tr style="background:#f0fdf4; color:#166534; font-weight:800; border-top:1px solid #bbf7d0;">
                            <td>Outstanding Account Balance</td>
                            <td style="text-align: right; color:#166534;">Rs. 0 (Fully Settled)</td>
                        </tr>
                        `}
                    </tbody>
                </table>

                <div class="payment-method" style="${remainingBalance > 0 ? "background:#fffbeb; border-color:#fde68a; color:#78350f;" : "background:#f0fdfa; border-color:#ccfbf1; color:#134e4a;"}">
                    <span>${remainingBalance > 0 ? "Payment Status:" : "Settlement Channel:"}</span>
                    <span>${remainingBalance > 0 ? `Partial Settlement · Remaining ${formatPKR(remainingBalance)} Pending` : (receiptData.paymentMethod || "Reception Counter Terminal Settlement")}</span>
                </div>

                <div class="footer-box">
                    <strong>Thank you for choosing Elite Dental Centre.</strong><br/>
                    For post-operative dental care or emergency consultations, please call our 24/7 desk at <strong>+92 314 5475528</strong>.<br/>
                    <em>Authorized, computer-generated clinical tax invoice. No signature required.</em>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[92vh] overflow-y-auto bg-white border border-slate-200/90 text-slate-900 shadow-2xl rounded-3xl p-5 sm:p-6 font-sans">
                <DialogHeader className="border-b border-slate-100 pb-3 pr-10">
                    <DialogTitle className="flex flex-wrap items-center gap-2.5 text-slate-900 text-base font-black tracking-tight">
                        <div className="flex items-center gap-2">
                            <ReceiptLongOutlinedIcon className="size-5 text-teal-600" />
                            <span>Official Clinical Invoice</span>
                        </div>
                        {isFullyPaid && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1 shadow-2xs">
                                <CheckCircleIcon sx={{ fontSize: 13 }} className="text-emerald-600" />
                                PAID IN FULL
                            </span>
                        )}
                        {isPartiallyPaid && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5 shadow-2xs">
                                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                                PARTIALLY PAID · DUE: {formatPKR(remainingBalance)}
                            </span>
                        )}
                        {isUnpaid && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 inline-flex items-center gap-1.5 shadow-2xs">
                                <span className="size-2 rounded-full bg-rose-500" />
                                PAYMENT DUE: {formatPKR(remainingBalance)}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {/* Printable Receipt Preview */}
                <div className="bg-slate-50/70 text-slate-900 rounded-2xl p-5 mt-1 border border-slate-200/90 shadow-2xs">
                    <div ref={receiptRef} className="space-y-4">
                        {/* Header with Authentic Logo & Clinic Details */}
                        <div className="flex items-start gap-3.5 pb-4 border-b-2 border-dashed border-slate-200">
                            <img
                                src="/logo.svg"
                                alt="Elite Dental Logo"
                                className="size-14 rounded-2xl shadow-xs shrink-0 bg-[#0B1528] p-1 border border-teal-500/30"
                            />
                            <div className="min-w-0 flex-1">
                                <h2 className="text-sm sm:text-base font-black text-[#0B1528] tracking-tight uppercase leading-snug">
                                    {data.clinicName || "Elite Dental & Aesthetic Centre"}
                                </h2>
                                <p className="text-[11px] font-bold text-teal-700 mt-0.5 flex items-center gap-1">
                                    <VerifiedOutlinedIcon sx={{ fontSize: 13 }} />
                                    <span>Premier Dental Surgery &amp; Implantology</span>
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">
                                    Doctors Plaza, 1st Floor, Office #6, 6 Markaz Rd, G-8/2, G-8 Markaz, Islamabad
                                </p>
                                <p className="text-[10px] text-slate-600 font-bold mt-0.5">
                                    Tel: +92 314 5475528 · WhatsApp: +92 331 2233447
                                </p>
                                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                                    PMDC Reg: #38942-D · NTN: 8241902-1
                                </p>
                            </div>
                        </div>

                        {/* Invoice Metadata Bar */}
                        <div className="flex items-center justify-between text-[11px] py-2 px-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                            <div>
                                <span className="text-slate-400 font-bold text-[10px] uppercase">Invoice No: </span>
                                <strong className="text-slate-900 font-black">#{receiptNum}</strong>
                            </div>
                            <div className="text-right">
                                <span className="text-slate-400 font-bold text-[10px] uppercase">Date: </span>
                                <strong className="text-slate-900 font-bold">
                                    {data.appointmentDate} {data.appointmentTime ? `· ${data.appointmentTime}` : ""}
                                </strong>
                            </div>
                        </div>

                        {/* Patient & Attending Doctor Dossier */}
                        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</p>
                                <p className="font-extrabold text-slate-900 mt-0.5">{data.patientName}</p>
                                {data.patientPhone && (
                                    <p className="text-[11px] text-slate-500 font-medium">{data.patientPhone}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attending Surgeon</p>
                                <p className="font-extrabold text-teal-900 mt-0.5">{data.doctorName || "Dr. Sheriyaar"}</p>
                                <p className="text-[10px] text-slate-500 font-semibold">{data.operatory || "Chair 1 · Surgical Suite"}</p>
                            </div>
                        </div>

                        {/* Itemized Billing Table */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                            <div className="flex items-center justify-between bg-slate-50 px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <span>Procedure Description</span>
                                <span>Amount</span>
                            </div>
                            <div className="px-3 py-2.5 flex items-center justify-between text-xs border-b border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-900">{data.treatmentName}</p>
                                    {data.sessionNumber ? (
                                        <span className="inline-block mt-0.5 text-[9px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                                            Session {data.sessionNumber} {data.totalSessions ? `of ${data.totalSessions}` : ""}
                                        </span>
                                    ) : null}
                                </div>
                                <span className="font-extrabold text-slate-900">{formatPKR(data.treatmentPrice)}</span>
                            </div>

                            {data.discount > 0 && (
                                <div className="px-3 py-1.5 flex items-center justify-between text-xs text-rose-600 border-b border-slate-100 font-semibold">
                                    <span>Promotional Discount</span>
                                    <span>- {formatPKR(data.discount)}</span>
                                </div>
                            )}

                            <div className="px-3 py-2 flex items-center justify-between text-xs font-black text-slate-900 bg-slate-50/70 border-b border-slate-200">
                                <span>Net Total</span>
                                <span>{formatPKR(netTotal)}</span>
                            </div>

                            <div className={`px-3 py-2.5 flex items-center justify-between text-xs font-black ${
                                amountPaid > 0 ? "text-emerald-900 bg-emerald-50/80" : "text-slate-600 bg-slate-50"
                            }`}>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircleIcon sx={{ fontSize: 14 }} className={amountPaid > 0 ? "text-emerald-600" : "text-slate-400"} />
                                    <span>Amount Settled / Paid</span>
                                </span>
                                <span className="text-sm font-black">{formatPKR(amountPaid)}</span>
                            </div>

                            {remainingBalance > 0 ? (
                                <div className="px-3.5 py-3 flex items-center justify-between text-xs font-black text-rose-900 bg-rose-50/90 border-t-2 border-rose-300">
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-2 rounded-full bg-rose-600 animate-pulse" />
                                            <span className="uppercase tracking-wider text-[11px] font-black">Remaining Balance Due</span>
                                        </div>
                                        <p className="text-[10px] text-rose-600 font-semibold mt-0.5 ml-3.5">
                                            Payable at next appointment session / installment
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-base font-black text-rose-700">{formatPKR(remainingBalance)}</span>
                                        <span className="block text-[9px] font-bold text-rose-500 uppercase tracking-wider">Outstanding</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-3 py-2 flex items-center justify-between text-[11px] font-bold text-emerald-800 bg-emerald-50/40 border-t border-emerald-100">
                                    <span>Outstanding Account Balance</span>
                                    <span className="font-extrabold text-emerald-700">Rs. 0 (Fully Settled)</span>
                                </div>
                            )}
                        </div>

                        {/* Settlement Channel Badge & Balance Notice */}
                        <div className={`flex items-center justify-between text-[11px] p-2.5 rounded-xl border font-bold ${
                            remainingBalance > 0
                                ? "bg-amber-50/90 border-amber-200 text-amber-950"
                                : "bg-teal-50/80 border-teal-200/90 text-teal-950"
                        }`}>
                            <span>{remainingBalance > 0 ? "Settlement Notice:" : "Settlement Channel:"}</span>
                            <span className="font-extrabold flex items-center gap-1.5">
                                {remainingBalance > 0 ? (
                                    <>
                                        <span className="size-2 rounded-full bg-amber-500" />
                                        <span>Partial Settlement · {formatPKR(remainingBalance)} Pending</span>
                                    </>
                                ) : (
                                    data.paymentMethod || "Reception Counter Terminal Settlement"
                                )}
                            </span>
                        </div>

                        {/* Official Receipt Footer */}
                        <div className="pt-3 border-t-2 border-dashed border-slate-200 text-center text-[10px] text-slate-500 space-y-1">
                            <p className="font-bold text-slate-800">Thank you for trusting Elite Dental &amp; Aesthetic Centre.</p>
                            <p className="text-slate-600">Doctors Plaza, G-8 Markaz, Islamabad · 24/7 Dental Helpline: +92 314 5475528</p>
                            <p className="text-[9px] text-slate-400 italic">This is an authorized, computer-generated clinical tax invoice.</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between gap-2 mt-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handlePrint}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl border-0 gap-2 shadow-xs text-xs cursor-pointer active:scale-95 transition-all"
                    >
                        <PrintOutlinedIcon className="size-4" />
                        Print Official Receipt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
