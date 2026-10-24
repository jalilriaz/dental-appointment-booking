import prisma from "@/lib/prisma";
import InventoryManager from "@/components/admin/InventoryManager";

export default async function InventoryPage() {
    const items = await prisma.inventory.findMany({
        orderBy: { itemName: "asc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Inventory</h1>
                <p className="text-sm text-slate-400 mt-1">Manage clinic supplies and track stock levels</p>
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
