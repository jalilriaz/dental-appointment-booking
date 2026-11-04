"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
            return server_1.NextResponse.json({ error: "No file received." }, { status: 400 });
        }
        // Strict MIME type validation
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(file.type)) {
            return server_1.NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WEBP images are allowed." }, { status: 400 });
        }
        // File size limit (e.g., 5 MB)
        if (file.size > 5 * 1024 * 1024) {
            return server_1.NextResponse.json({ error: "File size exceeds the 5MB limit." }, { status: 400 });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Sanitize filename to avoid weird characters
        const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const filename = `${Date.now()}-${originalName}`;
        const uploadDir = path_1.default.join(process.cwd(), "public/uploads/treatments");
        await (0, promises_1.mkdir)(uploadDir, { recursive: true });
        const filepath = path_1.default.join(uploadDir, filename);
        await (0, promises_1.writeFile)(filepath, buffer);
        const publicUrl = `/uploads/treatments/${filename}`;
        return server_1.NextResponse.json({ url: publicUrl, success: true });
    }
    catch (error) {
        console.error("Error saving file:", error);
        return server_1.NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}
