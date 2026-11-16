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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { formatPKR, formatDate, formatTime, numberToWordsPKR } from "@/lib/utils";

export interface ReceiptPaymentItem {
    id?: string;
    date: string;
    method?: string;
    amount: number;
    notes?: string | null;
}

export interface ReceiptData {
    receiptNumber?: string;
    invoiceNumber?: string;
    clinicName?: string;
    clinicAddress?: string;
    clinicPhone?: string;
    doctorName?: string;
    operatory?: string;
    patientName: string;
    patientPhone?: string;
    patientId?: string;
    patientCode?: number | null; // MR# e.g. 0659 or 1012
    patientAge?: string | null;
    patientGender?: string | null;
    treatmentName: string;
    appointmentDate: string;
    appointmentTime?: string;
    treatmentPrice: number;      // Total agreed rate / package fee
    discount: number;
    amountPaid: number;         // Amount in current transaction
    remainingBalance?: number;  // Current outstanding due
    paymentMethod?: string;
    sessionNumber?: number | null;
    totalSessions?: number | null;
    payments?: ReceiptPaymentItem[];
    totalPaid?: number;
    dueAmount?: number;
    recordedBy?: string;
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
    
    // Calculate cumulative payments if an installment ledger is attached
    const paymentsList = (data.payments && data.payments.length > 0)
        ? data.payments
        : (data.amountPaid > 0 ? [{
            date: data.appointmentDate || new Date().toISOString(),
            method: data.paymentMethod || "CASH",
            amount: data.amountPaid,
            notes: "Clinical payment",
        }] : []);

    const cumulativePaid = paymentsList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const dueAmount = typeof data.dueAmount === "number"
        ? Math.max(0, data.dueAmount)
        : Math.max(0, netTotal - cumulativePaid);

    const isFullyPaid = dueAmount <= 0 && (cumulativePaid > 0 || netTotal === 0);
    const isPartiallyPaid = dueAmount > 0 && cumulativePaid > 0;
    const isUnpaid = cumulativePaid === 0 && netTotal > 0;

    const receiptNum = data.invoiceNumber || data.receiptNumber || (data.patientCode ? `10${String(data.patientCode).padStart(4, "0")}` : `100${Math.floor(100 + Math.random() * 900)}`);
    const mrNumber = data.patientCode ? String(data.patientCode).padStart(4, "0") : (data.patientId ? data.patientId.slice(0, 4) : "0659");
    const doctorName = data.recordedBy || data.doctorName || "Dr. Shehryar Akhtar";
    const wordsAmount = numberToWordsPKR(netTotal);

    function handlePrint() {
        const receiptData = data!;
        const origin = typeof window !== "undefined" ? window.location.origin : "";

        const printWindow = window.open("", "_blank", "width=600,height=800");
        if (!printWindow) return;

        const paymentsLedgerHtml = paymentsList.map((p) => `
            <tr>
                <td style="padding: 4px 0; font-size: 11px; color: #1e293b;">
                    <strong>Date:</strong> ${formatDate(p.date)}
                </td>
                <td style="padding: 4px 8px; font-size: 11px; color: #1e293b;">
                    <strong>Payment Mode:</strong> ${p.method ? p.method.charAt(0).toUpperCase() + p.method.slice(1).toLowerCase() : "Cash"}
                </td>
                <td style="padding: 4px 0; text-align: right; font-size: 11px; font-weight: 700; color: #0f172a;">
                    Paid Amount: Rs. ${Number(p.amount).toLocaleString("en-PK")}.0/-
                </td>
            </tr>
        `).join("");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${receiptData.patientName} (MR# ${mrNumber})</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        padding: 30px 36px;
                        color: #0f172a;
                        background: #fff;
                        max-width: 580px;
                        margin: 0 auto;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    .clinic-header {
                        text-align: center;
                        margin-bottom: 12px;
                    }
                    .clinic-name {
                        font-size: 18px;
                        font-weight: 800;
                        color: #0f172a;
                        margin-bottom: 3px;
                        letter-spacing: 0.2px;
                    }
                    .clinic-address {
                        font-size: 10.5px;
                        color: #475569;
                        line-height: 1.35;
                    }
                    .divider {
                        border: none;
                        border-top: 1px solid #94a3b8;
                        margin: 10px 0 12px 0;
                    }
                    .meta-grid {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                        line-height: 1.5;
                        margin-bottom: 12px;
                    }
                    .meta-col strong {
                        color: #0f172a;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 10px 0 14px 0;
                    }
                    .items-table th {
                        text-align: left;
                        font-size: 11px;
                        font-weight: bold;
                        padding: 6px 0;
                        border-top: 1px solid #cbd5e1;
                        border-bottom: 1px solid #cbd5e1;
                        color: #0f172a;
                    }
                    .items-table td {
                        padding: 8px 0;
                        font-size: 11.5px;
                        color: #0f172a;
                    }
                    .words-line {
                        font-size: 11px;
                        margin-top: 10px;
                        margin-bottom: 8px;
                        color: #1e293b;
                    }
                    .ledger-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 8px 0;
                    }
                    .summary-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    .summary-table td {
                        padding: 3px 0;
                        font-size: 11.5px;
                    }
                    .summary-table .amount-col {
                        text-align: right;
                        font-weight: bold;
                    }
                    .grand-total-row td {
                        font-weight: 800;
                        border-top: 1px solid #cbd5e1;
                        padding-top: 6px;
                    }
                    .due-row td {
                        font-weight: 900;
                        color: #0f172a;
                    }
                    .footer-doctor {
                        margin-top: 36px;
                        font-size: 11px;
                        color: #0f172a;
                    }
                    @media print {
                        body { padding: 12px 18px; }
                        @page { margin: 6mm; size: auto; }
                    }
                </style>
            </head>
            <body>
                <div class="clinic-header">
                    <div class="clinic-name">Elite Dental Centre</div>
                    <div class="clinic-address">
                        Address: Office# 6, 1st Floor, Doctors Plaza, G-8 Markaz next to islamabad diagnostic centre, Islamabad<br/>
                        Phone: 051-2340093, 0303-5080011
                    </div>
                </div>

                <hr class="divider" />

                <div class="meta-grid">
                    <div class="meta-col">
                        <strong>Name:</strong> ${receiptData.patientName}<br/>
                        <strong>MR#:</strong> ${mrNumber}<br/>
                        <strong>Phone:</strong> ${receiptData.patientPhone || "N/A"}<br/>
                        <strong>Age/Gender:</strong> ${receiptData.patientAge || "Adult"}${receiptData.patientGender ? ` / ${receiptData.patientGender}` : ""}
                    </div>
                    <div class="meta-col" style="text-align: right;">
                        <strong>Date:</strong> ${receiptData.appointmentDate} ${receiptData.appointmentTime ? `- ${receiptData.appointmentTime}` : ""}<br/>
                        <strong>Invoice#:</strong> ${receiptNum}
                    </div>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 50%;">Description</th>
                            <th style="width: 20%; text-align: right;">Rate</th>
                            <th style="width: 10%; text-align: center;">Quantity</th>
                            <th style="width: 20%; text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>${receiptData.treatmentName}</strong>
                                ${receiptData.sessionNumber ? `<div style="font-size: 10px; color: #64748b;">Session #${receiptData.sessionNumber}</div>` : ""}
                            </td>
                            <td style="text-align: right;">${receiptData.treatmentPrice.toLocaleString("en-PK")}.0</td>
                            <td style="text-align: center;">1</td>
                            <td style="text-align: right;">${receiptData.treatmentPrice.toLocaleString("en-PK")}.0</td>
                        </tr>
                    </tbody>
                </table>

                <div class="words-line">
                    <strong>Amount in Words:</strong> ${wordsAmount}
                </div>

                <!-- Payment Installment Ledger Rows -->
                <table class="ledger-table">
                    <tbody>
                        ${paymentsLedgerHtml}
                    </tbody>
                </table>

                <!-- Totals & Balances -->
                <table class="summary-table">
                    <tbody>
                        <tr>
                            <td style="width: 65%;">Sub - Total:</td>
                            <td class="amount-col" style="width: 35%;">Rs. ${netTotal.toLocaleString("en-PK")}.00</td>
                        </tr>
                        <tr class="grand-total-row">
                            <td>Grand Total:</td>
                            <td class="amount-col">Rs. ${netTotal.toLocaleString("en-PK")}.0/-</td>
                        </tr>
                        <tr>
                            <td>Total Paid:</td>
                            <td class="amount-col">Rs. ${cumulativePaid.toLocaleString("en-PK")}.0</td>
                        </tr>
                        <tr class="due-row">
                            <td>Due Amount:</td>
                            <td class="amount-col">Rs. ${dueAmount.toLocaleString("en-PK")}.0</td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer-doctor">
                    Recorded By: <strong>${doctorName}</strong>
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
            <DialogContent className="sm:max-w-[540px] max-h-[92vh] overflow-y-auto bg-white border border-slate-200/90 text-slate-900 shadow-2xl rounded-3xl p-5 sm:p-6 font-sans">
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
                                PARTIALLY PAID · DUE: {formatPKR(dueAmount)}
                            </span>
                        )}
                        {isUnpaid && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 inline-flex items-center gap-1.5 shadow-2xs">
                                <span className="size-2 rounded-full bg-rose-500" />
                                PAYMENT DUE: {formatPKR(dueAmount)}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {/* Printable Receipt Preview (Matching Physical Clinic Slip) */}
                <div className="bg-slate-50/70 text-slate-900 rounded-2xl p-5 mt-1 border border-slate-200/90 shadow-2xs">
                    <div ref={receiptRef} className="space-y-3 font-sans">
                        {/* Header matching clinic paper slip */}
                        <div className="text-center pb-2">
                            <h2 className="text-base font-black text-slate-900 tracking-tight">
                                Elite Dental Centre
                            </h2>
                            <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">
                                Address: Office# 6, 1st Floor, Doctors Plaza, G-8 Markaz next to islamabad diagnostic centre, Islamabad
                            </p>
                            <p className="text-[11px] text-slate-700 font-bold mt-0.5">
                                Phone: 051-2340093, 0303-5080011
                            </p>
                        </div>

                        <div className="border-t border-slate-300 pt-2.5">
                            <div className="grid grid-cols-2 text-xs leading-relaxed">
                                <div>
                                    <p><strong>Name:</strong> {data.patientName}</p>
                                    <p><strong>MR#:</strong> {mrNumber}</p>
                                    <p><strong>Phone:</strong> {data.patientPhone || "N/A"}</p>
                                    <p><strong>Age/Gender:</strong> {data.patientAge || "Adult"}{data.patientGender ? ` / ${data.patientGender}` : ""}</p>
                                </div>
                                <div className="text-right">
                                    <p><strong>Date:</strong> {data.appointmentDate} {data.appointmentTime ? `- ${data.appointmentTime}` : ""}</p>
                                    <p><strong>Invoice#:</strong> {receiptNum}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="border-t border-b border-slate-300 py-1.5">
                            <div className="grid grid-cols-12 text-[11px] font-bold text-slate-700 pb-1 border-b border-slate-200">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-3 text-right">Rate</div>
                                <div className="col-span-1 text-center">Qty</div>
                                <div className="col-span-2 text-right">Amount</div>
                            </div>
                            <div className="grid grid-cols-12 text-xs py-1.5 font-medium text-slate-900">
                                <div className="col-span-6 font-bold">
                                    {data.treatmentName}
                                    {data.sessionNumber ? (
                                        <span className="block text-[10px] text-teal-700 font-bold">Session #{data.sessionNumber}</span>
                                    ) : null}
                                </div>
                                <div className="col-span-3 text-right">{data.treatmentPrice.toLocaleString("en-PK")}.0</div>
                                <div className="col-span-1 text-center">1</div>
                                <div className="col-span-2 text-right font-bold">{data.treatmentPrice.toLocaleString("en-PK")}.0</div>
                            </div>
                        </div>

                        {/* Amount in words */}
                        <div className="text-xs text-slate-700 pt-1">
                            <strong>Amount in Words:</strong> {wordsAmount}
                        </div>

                        {/* Payment Installments Ledger */}
                        {paymentsList.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-1.5 text-xs">
                                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Payment History Ledger</p>
                                {paymentsList.map((p, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-b-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-800">{formatDate(p.date)}</span>
                                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                                {p.method ? p.method.charAt(0).toUpperCase() + p.method.slice(1).toLowerCase() : "Cash"}
                                            </span>
                                        </div>
                                        <span className="font-extrabold text-slate-900">Paid: {formatPKR(p.amount)}/-</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Totals Summary */}
                        <div className="space-y-1 text-xs pt-1 border-t border-slate-200">
                            <div className="flex justify-between text-slate-600">
                                <span>Sub - Total:</span>
                                <span className="font-bold">{formatPKR(netTotal)}</span>
                            </div>
                            <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-1">
                                <span>Grand Total:</span>
                                <span>{formatPKR(netTotal)}/-</span>
                            </div>
                            <div className="flex justify-between font-extrabold text-emerald-800 bg-emerald-50/80 px-2 py-1 rounded-lg">
                                <span>Total Paid:</span>
                                <span>{formatPKR(cumulativePaid)}</span>
                            </div>
                            <div className={`flex justify-between font-black px-2 py-1 rounded-lg ${dueAmount > 0 ? "bg-amber-50 text-amber-950 border border-amber-200" : "bg-slate-100 text-slate-700"}`}>
                                <span>Due Amount:</span>
                                <span>{dueAmount > 0 ? formatPKR(dueAmount) : "Rs. 0 (Fully Settled)"}</span>
                            </div>
                        </div>

                        {/* Recorded by Doctor */}
                        <div className="pt-3 text-xs text-slate-700">
                            Recorded By: <strong>{doctorName}</strong>
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
                        Print Clinical Invoice
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
