"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, DollarSign } from "lucide-react";
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
            const res = await fetch(`/api/patient-treatments/${treatmentPlanId}/payments`, {
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
                    className="gap-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                    <DollarSign className="size-4" />
                    Record Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Record a new installment payment for {treatmentName}.
                        <br />
                        Remaining Balance: <strong className="text-amber-400">Rs. {remainingBalance.toLocaleString("en-PK")}</strong>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (PKR) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            min="1"
                            max={remainingBalance}
                            placeholder={`Max: ${remainingBalance}`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="method">Payment Method</Label>
                        <Select value={method} onValueChange={setMethod}>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                <SelectItem value="CASH">Cash</SelectItem>
                                <SelectItem value="CARD">Card</SelectItem>
                                <SelectItem value="ONLINE">Online Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                            id="notes"
                            placeholder="e.g. 2nd Installment"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="hover:bg-slate-800 hover:text-slate-300"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
