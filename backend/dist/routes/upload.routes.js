"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Configure storage to save to frontend/public/uploads/treatments so frontend can serve images directly
const uploadDir = path_1.default.resolve(process.cwd(), '../frontend/public/uploads/treatments');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, `${Date.now()}-${sanitized}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only JPG, PNG, and WEBP images are allowed.'));
        }
    },
});
// POST /api/upload
router.post('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file received.' });
    }
    const publicUrl = `/uploads/treatments/${req.file.filename}`;
    return res.json({ url: publicUrl, success: true });
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map