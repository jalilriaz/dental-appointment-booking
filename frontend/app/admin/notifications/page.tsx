import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth/permissions";
import NotificationLogPanel from "@/features/operations/NotificationLogPanel";

export default async function AdminNotificationsPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/notifications" });

    const logs = await prisma.notificationLog.findMany({
        include: { patient: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    const initialLogs = logs.map((l) => ({
        id: l.id,
        channel: l.channel,
        recipient: l.recipient,
        templateKey: l.templateKey,
        messagePreview: l.messagePreview,
        status: l.status,
        errorMessage: l.errorMessage,
        sentAt: l.sentAt ? l.sentAt.toISOString() : null,
        createdAt: l.createdAt.toISOString(),
        patientName: l.patient?.name || null,
    }));

    return <NotificationLogPanel initialLogs={initialLogs} />;
}
