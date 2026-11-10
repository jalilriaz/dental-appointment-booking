import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Configure storage to save to frontend/public/uploads/treatments so frontend can serve images directly
const uploadDir = path.resolve(process.cwd(), '../frontend/public/uploads/treatments');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, `${Date.now()}-${sanitized}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, and WEBP images are allowed.'));
        }
    },
});

// POST /api/upload
router.post('/', requireAuth, requireRole('ADMIN'), upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file received.' });
    }

    const publicUrl = `/uploads/treatments/${req.file.filename}`;
    return res.json({ url: publicUrl, success: true });
});

export default router;

