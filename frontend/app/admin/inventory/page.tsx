import prisma from "@/lib/prisma";
import InventoryManager from "@/components/admin/InventoryManager";

export default async function InventoryPage() {
    const items = await prisma.inventory.findMany({
        orderBy: { itemName: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="border-b border-slate-200/80 pb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block mb-2">
                    Clinic Supplies
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight font-sans">
                    Dental Inventory & Supplies
                </h1>
                <p className="text-sm font-medium text-slate-600 mt-1">
                    Manage operatory supplies, sterilization consumables, and monitor critical threshold stock levels.
                </p>
            </div>
            <InventoryManager
                initialItems={items.map(item => ({
                    ...item,
                    createdAt: item.createdAt.toISOString(),
                    updatedAt: item.updatedAt.toISOString(),
                }))}
            />
        </div>
    );
}
