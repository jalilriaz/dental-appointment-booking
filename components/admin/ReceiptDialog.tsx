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
import { Printer, Download, Receipt } from "lucide-react";
import { formatPKR } from "@/lib/utils";


interface ReceiptData {
    clinicName?: string;
    patientName: string;
    patientPhone?: string;
    treatmentName: string;
    appointmentDate: string;
    treatmentPrice: number;
    discount: number;
    amountPaid: number;
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

    const netTotal = Math.max(0, data.treatmentPrice - data.discount);

    function handlePrint() {
        const receiptData = data!;
        const printContent = receiptRef.current;
        if (!printContent) return;

        const printWindow = window.open("", "_blank", "width=400,height=600");
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - ${receiptData.patientName}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 24px; color: #111; max-width: 400px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px dashed #ddd; }
                    .header h1 { font-size: 18px; font-weight: 700; color: #0d9488; }
                    .header p { font-size: 11px; color: #666; margin-top: 4px; }
                    .section { margin-bottom: 16px; }
                    .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 600; margin-bottom: 8px; }
                    .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
                    .row .label { color: #555; }
                    .row .value { font-weight: 600; }
                    .divider { border-top: 1px dashed #ddd; margin: 12px 0; }
                    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; font-weight: 700; border-top: 2px solid #111; margin-top: 8px; }
                    .discount { color: #dc2626; }
                    .paid { color: #0d9488; }
                    .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 2px dashed #ddd; font-size: 11px; color: #888; }
                    @media print { body { padding: 12px; } }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
                <script>window.print(); window.close();</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] bg-slate-900 border-white/[0.06] text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="size-5 text-teal-400" />
                        Payment Receipt
                    </DialogTitle>
                </DialogHeader>

                {/* Receipt Preview */}
                <div className="bg-white text-slate-900 rounded-lg p-5 mt-2 shadow-inner">
                    <div ref={receiptRef}>
                        <div className="header" style={{ textAlign: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "2px dashed #ddd" }}>
                            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#0d9488" }}>
                                {data.clinicName || "Elite Dental Centre"}
                            </h1>
                            <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                                Payment Receipt
                            </p>
                        </div>

                        <div style={{ marginBottom: 14 }}>
                            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888", fontWeight: 600, marginBottom: 6 }}>
                                Patient Details
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 13 }}>
                                <span style={{ color: "#555" }}>Name</span>
                                <span style={{ fontWeight: 600 }}>{data.patientName}</span>
                            </div>
                            {data.patientPhone && (
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 13 }}>
                                    <span style={{ color: "#555" }}>Phone</span>
                                    <span style={{ fontWeight: 600 }}>{data.patientPhone}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 13 }}>
                                <span style={{ color: "#555" }}>Date</span>
                                <span style={{ fontWeight: 600 }}>{data.appointmentDate}</span>
                            </div>
                        </div>

                        <div style={{ borderTop: "1px dashed #ddd", margin: "10px 0" }} />

                        <div style={{ marginBottom: 14 }}>
                            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888", fontWeight: 600, marginBottom: 6 }}>
                                Treatment
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 13 }}>
                                <span style={{ color: "#555" }}>{data.treatmentName}</span>
                                <span style={{ fontWeight: 600 }}>{formatPKR(data.treatmentPrice)}</span>
                            </div>
                            {data.discount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 13, color: "#dc2626" }}>
                                    <span>Discount</span>
                                    <span style={{ fontWeight: 600 }}>- {formatPKR(data.discount)}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 15, fontWeight: 700, borderTop: "2px solid #111" }}>
                            <span>Net Total</span>
                            <span>{formatPKR(netTotal)}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#0d9488" }}>
                            <span style={{ fontWeight: 600 }}>Amount Paid</span>
                            <span style={{ fontWeight: 700 }}>{formatPKR(data.amountPaid)}</span>
                        </div>

                        {data.amountPaid < netTotal && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#dc2626" }}>
                                <span style={{ fontWeight: 600 }}>Balance Due</span>
                                <span style={{ fontWeight: 700 }}>{formatPKR(netTotal - data.amountPaid)}</span>
                            </div>
                        )}

                        <div style={{ textAlign: "center", marginTop: 20, paddingTop: 14, borderTop: "2px dashed #ddd", fontSize: 11, color: "#888" }}>
                            <p>Thank you for choosing {data.clinicName || "Elite Dental Centre"}</p>
                            <p style={{ marginTop: 2 }}>Get well soon! 😊</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center gap-2 mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 text-slate-300 hover:bg-white/5">
                        Close
                    </Button>
                    <Button onClick={handlePrint} className="btn-brand border-0 gap-2 shadow-lg shadow-teal-500/20">
                        <Printer className="size-4" />
                        Print Receipt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
