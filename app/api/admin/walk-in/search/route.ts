import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const role = session.role as string;
        if (role !== "ADMIN" && role !== "STAFF") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.trim() || "";
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = 8;
        const skip = (page - 1) * limit;

        // Build where clause — show all patients, optionally filtered by search
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = { role: "PATIENT" };
        if (query.length >= 2) {
            const conditions: any[] = [
                { name: { contains: query, mode: "insensitive" } },
                { phone: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ];
            // If query is a number, also search by patientCode
            const numericQuery = parseInt(query);
            if (!isNaN(numericQuery)) {
                conditions.push({ patientCode: numericQuery });
            }
            where.OR = conditions;
        }

        const [patients, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                    patientCode: true,
                    medicalAlerts: true,
                    createdAt: true,
                    appointments: {
                        select: {
                            id: true,
                            startTime: true,
                            status: true,
                            treatment: { select: { name: true } },
                        },
                        orderBy: { startTime: "desc" },
                        take: 1,
                    },
                    _count: { select: { appointments: true } },
                },
                skip,
                take: limit,
                orderBy: { name: "asc" },
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            patients,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Walk-in search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
