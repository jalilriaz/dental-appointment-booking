import test from "node:test";
import assert from "node:assert/strict";
import { detectRealFileType, stripImageMetadata } from "../imageStrip";
import { detectAllergyConflicts } from "../allergyConflicts";

test("detectRealFileType rejects spoofed content and verifies magic bytes", () => {
    const spoofed = Buffer.from("<html><script>alert(1)</script></html>");
    assert.equal(detectRealFileType(spoofed), null);

    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    assert.deepEqual(detectRealFileType(pngHeader), { mimeType: "image/png", ext: "png" });

    const pdfHeader = Buffer.from("%PDF-1.7\n1 0 obj\n");
    assert.deepEqual(detectRealFileType(pdfHeader), { mimeType: "application/pdf", ext: "pdf" });
});

test("stripImageMetadata removes EXIF/APP1 GPS marker from JPEG", () => {
    const soi = Buffer.from([0xff, 0xd8]);
    const exifPayload = Buffer.from("Exif\0\0GPSLatitude_33.6844N");
    const app1 = Buffer.alloc(4 + exifPayload.length);
    app1[0] = 0xff;
    app1[1] = 0xe1;
    app1.writeUInt16BE(2 + exifPayload.length, 2);
    exifPayload.copy(app1, 4);

    const sof0 = Buffer.from([0xff, 0xc0, 0x00, 0x04, 0x08, 0x01]);
    const eoi = Buffer.from([0xff, 0xd9]);
    const rawJpeg = Buffer.concat([soi, app1, sof0, eoi]);

    const stripped = stripImageMetadata(rawJpeg, "image/jpeg");
    assert.equal(stripped.includes(Buffer.from("GPSLatitude")), false);
    assert.equal(stripped[0], 0xff);
    assert.equal(stripped[1], 0xd8);
    assert.equal(stripped.includes(sof0), true);
});

test("detectAllergyConflicts flags direct and class medication conflicts", () => {
    const conflicts = detectAllergyConflicts(
        [
            { drug: "Augmentin 625mg", dose: "1 tab", frequency: "BD", duration: "5 days" },
            { drug: "Paracetamol 500mg", dose: "1 tab", frequency: "SOS", duration: "3 days" },
        ],
        ["Penicillin"]
    );
    assert.equal(conflicts.length, 1);
    assert.match(conflicts[0], /Penicillin/i);

    const nsaidConflict = detectAllergyConflicts(
        [{ drug: "Brufen 400mg", dose: "1 tab", frequency: "TDS", duration: "3 days" }],
        ["NSAID"]
    );
    assert.equal(nsaidConflict.length, 1);
});
