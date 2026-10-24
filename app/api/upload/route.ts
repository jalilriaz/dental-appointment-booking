import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // Strict MIME type validation
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WEBP images are allowed." }, { status: 400 });
        }

        // File size limit (e.g., 5 MB)
        if (file.size > 5 * 1024 * 1024) {
             return NextResponse.json({ error: "File size exceeds the 5MB limit." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename to avoid weird characters
        const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const filename = `${Date.now()}-${originalName}`;
        
        const uploadDir = path.join(process.cwd(), "public/uploads/treatments");
        await mkdir(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        const publicUrl = `/uploads/treatments/${filename}`;

        return NextResponse.json({ url: publicUrl, success: true });
    } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}
