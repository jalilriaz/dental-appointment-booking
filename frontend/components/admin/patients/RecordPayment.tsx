"use client";
import { fetchApi } from "@/lib/api-client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface RecordPaymentProps {
    treatmentPlanId: string;
    treatmentName: string;
    remainingBalance: number;
}

export default function RecordPayment({ treatmentPlanId, treatmentName, remainingBalance }: RecordPaymentProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("CASH");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid payment amount");
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetchApi(`/api/patient-treatments/${treatmentPlanId}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(amount),
                    method,
                    notes: notes || `Installment payment for ${treatmentName}`,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to record payment");
            }

            toast.success("Payment recorded successfully!");
            setOpen(false);

            // Reset form
            setAmount("");
            setMethod("CASH");
            setNotes("");

            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (remainingBalance <= 0) return null; // Don't show if fully paid

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-semibold rounded-xl shadow-xs transition-premium"
                >
                    <AttachMoneyOutlinedIcon className="size-4" />
                    Record Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">Record Payment</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Record a new installment payment for {treatmentName}.
                        <br />
                        Remaining Balance: <strong className="text-amber-800 font-bold">Rs. {remainingBalance.toLocaleString("en-PK")}</strong>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="amount" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Amount (PKR) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            min="1"
                            max={remainingBalance}
                            placeholder={`Max: ${remainingBalance}`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="method" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Method</Label>
                        <Select value={method} onValueChange={setMethod}>
                            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus:border-teal-500 focus:ring-teal-500/20">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-xl rounded-xl">
                                <SelectItem value="CASH">Cash</SelectItem>
                                <SelectItem value="CARD">Card</SelectItem>
                                <SelectItem value="ONLINE">Online Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notes (Optional)</Label>
                        <Input
                            id="notes"
                            placeholder="e.g. 2nd Installment"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 placeholder:text-slate-400"
                        />
                    </div>

                    <DialogFooter className="pt-4 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <AutorenewOutlinedIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Recording...
                                </>
                            ) : (
                                "Record Payment"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
