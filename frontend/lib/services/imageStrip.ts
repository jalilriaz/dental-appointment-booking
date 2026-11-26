export type AllowedMimeType = "image/jpeg" | "image/png" | "image/webp" | "application/pdf";

export function detectRealFileType(
    buf: Buffer
): { mimeType: AllowedMimeType; ext: string } | null {
    if (buf.length < 12) return null;
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        return { mimeType: "image/jpeg", ext: "jpg" };
    }
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
        return { mimeType: "image/png", ext: "png" };
    }
    if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
        return { mimeType: "image/webp", ext: "webp" };
    }
    if (buf.subarray(0, 5).toString("ascii") === "%PDF-") {
        return { mimeType: "application/pdf", ext: "pdf" };
    }
    return null;
}

function stripJpegMetadata(buf: Buffer): Buffer {
    if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return buf;
    const chunks: Buffer[] = [buf.subarray(0, 2)];
    let offset = 2;
    while (offset + 4 <= buf.length) {
        if (buf[offset] !== 0xff) {
            chunks.push(buf.subarray(offset));
            break;
        }
        const marker = buf[offset + 1];
        if (marker === 0xda || marker === 0xd9) {
            chunks.push(buf.subarray(offset));
            break;
        }
        if (marker >= 0xd0 && marker <= 0xd8) {
            chunks.push(buf.subarray(offset, offset + 2));
            offset += 2;
            continue;
        }
        const segLen = buf.readUInt16BE(offset + 2);
        if (segLen < 2 || offset + 2 + segLen > buf.length) {
            chunks.push(buf.subarray(offset));
            break;
        }
        const isMeta = marker === 0xe1 || marker === 0xe2 || marker === 0xfe;
        if (!isMeta) {
            chunks.push(buf.subarray(offset, offset + 2 + segLen));
        }
        offset += 2 + segLen;
    }
    return Buffer.concat(chunks);
}

function stripPngMetadata(buf: Buffer): Buffer {
    if (buf.length < 8) return buf;
    const strippedTypes = new Set(["eXIf", "tEXt", "zTXt", "iTXt", "tIME"]);
    const out: Buffer[] = [buf.subarray(0, 8)];
    let offset = 8;
    while (offset + 12 <= buf.length) {
        const len = buf.readUInt32BE(offset);
        const type = buf.subarray(offset + 4, offset + 8).toString("ascii");
        const total = 12 + len;
        if (offset + total > buf.length) break;
        if (!strippedTypes.has(type)) out.push(buf.subarray(offset, offset + total));
        offset += total;
    }
    return Buffer.concat(out);
}

function stripWebpMetadata(buf: Buffer): Buffer {
    if (buf.length < 12) return buf;
    const chunks: Buffer[] = [];
    let offset = 12;
    while (offset + 8 <= buf.length) {
        const fourCc = buf.subarray(offset, offset + 4).toString("ascii");
        const size = buf.readUInt32LE(offset + 4);
        const padded = size + (size % 2);
        const total = 8 + padded;
        if (offset + total > buf.length) break;
        if (fourCc !== "EXIF" && fourCc !== "XMP ") {
            chunks.push(buf.subarray(offset, offset + total));
        }
        offset += total;
    }
    const body = Buffer.concat(chunks);
    const header = Buffer.from(buf.subarray(0, 12));
    header.writeUInt32LE(4 + body.length, 4);
    return Buffer.concat([header, body]);
}

export function stripImageMetadata(buf: Buffer, mimeType: AllowedMimeType): Buffer {
    if (mimeType === "image/jpeg") return stripJpegMetadata(buf);
    if (mimeType === "image/png") return stripPngMetadata(buf);
    if (mimeType === "image/webp") return stripWebpMetadata(buf);
    return buf;
}
