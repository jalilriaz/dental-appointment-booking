import { PrismaClient } from "@prisma/client";
import { normalizePhone } from "../lib/phone";

const prisma = new PrismaClient();

async function main() {
    console.log("=== SCANNING FOR DUPLICATE PATIENT PHONE NUMBERS ===");

    const users = await prisma.user.findMany({
        where: {
            phone: { not: null },
        },
        select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            patientCode: true,
            createdAt: true,
        },
    });

    const groups = new Map<string, typeof users>();

    for (const u of users) {
        if (!u.phone) continue;
        const canonical = normalizePhone(u.phone);
        if (!groups.has(canonical)) {
            groups.set(canonical, []);
        }
        groups.get(canonical)!.push(u);
    }

    let duplicatesFound = 0;

    for (const [canonical, list] of groups.entries()) {
        if (list.length > 1) {
            duplicatesFound++;
            console.log(`\n🚨 COLLISION DETECTED: [${canonical}] (${list.length} accounts)`);
            list.forEach((u) => {
                console.log(`  - ID: ${u.id} | Name: ${u.name} | Raw Phone: ${u.phone} | Code: ${u.patientCode ?? "N/A"} | Role: ${u.role} | Created: ${u.createdAt.toISOString()}`);
            });
        }
    }

    if (duplicatesFound === 0) {
        console.log(`\n✅ No duplicate phone numbers found across ${users.length} patient records.`);
    } else {
        console.log(`\n⚠️  Found ${duplicatesFound} phone number collisions that should be inspected before linking.`);
    }

    await prisma.$disconnect();
}

main().catch((err) => {
    console.error("Error scanning duplicates:", err);
    process.exit(1);
});
