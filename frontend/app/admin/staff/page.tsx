import prisma from "@/lib/prisma";
import StaffManager from "@/components/admin/StaffManager";
import { Role } from "@prisma/client";

export default async function AdminStaffPage() {
    const staffMembers = await prisma.user.findMany({
        where: { role: { in: [Role.STAFF, Role.ADMIN] } },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "asc" },
    });

    return (
        <StaffManager initialStaff={staffMembers} />
    );
}
