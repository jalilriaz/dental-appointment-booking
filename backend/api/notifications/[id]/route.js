"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
async function PATCH(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const userId = session.id;
        const { id } = await params;
        // Ensure notification belongs to user
        // const notification = await prisma.notification.findFirst({
        //     where: { id, userId },
        // });
        // if (!notification) {
        //     return NextResponse.json({ error: "Not found" }, { status: 404 });
        // }
        // const updated = await prisma.notification.update({
        //     where: { id },
        //     data: { read: true },
        // });
        return server_1.NextResponse.json({ success: true, notification: null });
    }
    catch (error) {
        console.error("Update notification error:", error);
        return server_1.NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
