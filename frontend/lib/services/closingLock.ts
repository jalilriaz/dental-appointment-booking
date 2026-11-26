import prisma from "@/lib/prisma";
import { getKarachiDateKey } from "@/lib/format";
import { getKarachiBoundsForDateKey } from "@/lib/karachi-date";
import { isDayLockedByClosingStatus } from "@/lib/services/moneyMath";

export async function getClosingStatusForDate(targetDate: Date): Promise<{
    dateKey: string;
    isClosed: boolean;
    status: string | null;
}> {
    const dateKey = getKarachiDateKey(targetDate);
    const { closingDateUtc } = getKarachiBoundsForDateKey(dateKey);
    const closing = await prisma.dailyClosing.findUnique({
        where: { closingDate: closingDateUtc },
        select: { status: true },
    });
    return {
        dateKey,
        status: closing?.status || null,
        isClosed: isDayLockedByClosingStatus(closing?.status),
    };
}

export async function assertDayNotClosed(targetDate: Date): Promise<void> {
    const info = await getClosingStatusForDate(targetDate);
    if (info.isClosed) {
        throw new Error(
            `Day ${info.dateKey} is closed and locked. Reopen it in Daily Closing before modifying entries.`
        );
    }
}
