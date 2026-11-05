"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
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

import type { Treatment } from "@/lib/types";

interface CreateTreatmentPlanProps {
    patientId: string;
    availableTreatments: Treatment[];
}

export default function CreateTreatmentPlan({ patientId, availableTreatments }: CreateTreatmentPlanProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedTreatmentId, setSelectedTreatmentId] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [initialPayment, setInitialPayment] = useState("");
    const [method, setMethod] = useState("CASH");

    // Auto-fill total cost when a treatment is selected
    const handleTreatmentSelect = (id: string) => {
        setSelectedTreatmentId(id);
        const treatment = availableTreatments.find(t => t.id === id);
        if (treatment && treatment.price > 0) {
            setTotalCost(treatment.price.toString());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTreatmentId || !totalCost) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch("/api/patient-treatments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId,
                    treatmentId: selectedTreatmentId,
                    totalCost: Number(totalCost),
                    initialPayment: initialPayment ? Number(initialPayment) : 0,
                    method,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create treatment plan");
            }

            toast.success("Treatment plan created successfully!");
            setOpen(false);

            // Reset form
            setSelectedTreatmentId("");
            setTotalCost("");
            setInitialPayment("");
            setMethod("CASH");

            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs transition-premium active:scale-95">
                    <AddOutlinedIcon className="size-4" />
                    New Treatment Plan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">Create Treatment Plan</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Set up a new long-term treatment plan (e.g., Braces, Implants) for this patient.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="treatment" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Treatment *</Label>
                        <Select
                            value={selectedTreatmentId}
                            onValueChange={handleTreatmentSelect}
                        >
                            <SelectTrigger id="treatment" className="bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus:border-teal-500 focus:ring-teal-500/20">
                                <SelectValue placeholder="Select a treatment" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-xl rounded-xl">
                                {availableTreatments.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="totalCost" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Agreed Total Cost (PKR) *</Label>
                        <Input
                            id="totalCost"
                            type="number"
                            min="0"
                            placeholder="e.g. 110000"
                            value={totalCost}
                            onChange={(e) => setTotalCost(e.target.value)}
                            className="bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="initialPayment" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Down Payment Today (PKR)</Label>
                        <Input
                            id="initialPayment"
                            type="number"
                            min="0"
                            placeholder="e.g. 30000"
                            value={initialPayment}
                            onChange={(e) => setInitialPayment(e.target.value)}
                            className="bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 placeholder:text-slate-400"
                        />
                    </div>

                    {Number(initialPayment) > 0 && (
                        <div className="space-y-1.5 pt-1 animate-in fade-in zoom-in-95 duration-200">
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
                    )}

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
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <AutorenewOutlinedIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Plan"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
