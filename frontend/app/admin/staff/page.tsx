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
            // specialization: true,
            // bio: true,
            // workingHours: true,
            // _count: { select: { appointments: true } } // This tracks patient appointments, not staff assignments
        },
        orderBy: { createdAt: "asc" },
    });

    return (
        <StaffManager initialStaff={staffMembers} />
    );
}
