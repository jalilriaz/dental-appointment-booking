import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { google } from 'googleapis';
import { z } from 'zod';
import {
    verifyPassword,
    hashPassword,
    signAccessToken,
    signRefreshToken,
    decrypt,
} from '../lib/auth';
import { sendPasswordResetEmail, sendAccountSetupEmail } from '../lib/email';
import { extractToken, requireAuth } from '../middleware/auth.middleware';

const router = Router();

const loginSchema = z.object({
    email: z.string().email().max(150),
    password: z.string().min(1).max(250),
});

const setupPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(6),
    phone: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const parseResult = loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid email or password format' });
        }

        const { email, password } = parseResult.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (user.role === 'PATIENT') {
            return res.status(403).json({
                error: 'Patient web portal has moved to WhatsApp. Please message us on WhatsApp at +92 314 5475528 to manage your appointments.',
                code: 'PATIENT_PORTAL_DEPRECATED',
            });
        }

        const accessToken = await signAccessToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        const refreshToken = await signRefreshToken({
            id: user.id,
        });

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('session', accessToken, {
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
        });

        res.cookie('refreshToken', refreshToken, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
        });

        return res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: accessToken,
        });
    } catch (error: any) {
        return res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

// Helper to clear auth cookies with proper flags
const clearAuthCookies = (res: Response) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOpts = {
        path: '/',
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
        expires: new Date(0),
        maxAge: 0,
    };
    res.clearCookie('session', cookieOpts);
    res.clearCookie('refreshToken', cookieOpts);
    res.clearCookie('token', cookieOpts);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
};

// GET /api/auth/logout (Direct navigation / fallback)
router.get('/logout', (_req: Request, res: Response) => {
    clearAuthCookies(res);
    return res.redirect('/');
});

// POST /api/auth/logout (Client API call)
router.post('/logout', (_req: Request, res: Response) => {
    clearAuthCookies(res);
    return res.json({ success: true, redirect: '/' });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: Request, res: Response) => {
    return res.json({ user: req.user });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });

        const appUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

        try {
            await sendPasswordResetEmail(email, resetLink);
        } catch (emailErr) {
            console.error('[FORGOT PASSWORD] Failed to send email:', emailErr);
        }

        return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and password are required' });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

// POST /api/auth/register-request
router.post('/register-request', async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing && existing.password) {
            return res.status(409).json({ error: 'This email is already registered. Please login instead.' });
        }

        const setupToken = crypto.randomBytes(32).toString('hex');
        const setupTokenExpiry = new Date(Date.now() + 24 * 3600000);

        if (existing) {
            await prisma.user.update({
                where: { email },
                data: {
                    name,
                    resetToken: setupToken,
                    resetTokenExpiry: setupTokenExpiry,
                },
            });
        } else {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    resetToken: setupToken,
                    resetTokenExpiry: setupTokenExpiry,
                    role: 'PATIENT' as any,
                },
            });
        }

        const appUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const setupLink = `${appUrl}/setup-password?token=${setupToken}`;

        try {
            await sendAccountSetupEmail(email, name, setupLink);
        } catch (emailErr) {
            console.error('[REGISTER REQUEST] Email send error:', emailErr);
        }

        return res.json({
            success: true,
            message: 'Registration request received. Please check your email to complete setup.',
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/setup-password
router.post('/setup-password', async (req: Request, res: Response) => {
    try {
        const parseResult = setupPasswordSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const { token, password, phone, dateOfBirth, gender, address } = parseResult.data;

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const hashedPassword = await hashPassword(password);

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                phone: phone || user.phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth,
                gender: gender || user.gender,
                address: address || user.address,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        const accessToken = await signAccessToken({
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
        });

        const refreshToken = await signRefreshToken({
            id: updatedUser.id,
        });

        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('session', accessToken, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
        });

        res.cookie('refreshToken', refreshToken, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
        });

        return res.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

// GET /api/auth/google
router.get('/google', (_req: Request, res: Response) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
    });

    return res.redirect(url);
});

// GET /api/auth/google/callback
router.get('/google/callback', async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        if (!code) {
            return res.status(400).json({ error: 'Missing authorization code' });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const session = await decrypt(token);
        const userId = session.id as string;
        const role = session.role as string;

        await prisma.user.update({
            where: { id: userId },
            data: {
                googleCalendarToken: JSON.stringify(tokens),
                googleCalendarRefreshToken: tokens.refresh_token || undefined,
                googleCalendarConnected: true,
            },
        });

        const appUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        if (role === 'ADMIN') {
            return res.redirect(`${appUrl}/admin/settings`);
        } else if (role === 'STAFF') {
            return res.redirect(`${appUrl}/staff`);
        }
        return res.redirect(`${appUrl}/`);
    } catch (error) {
        console.error('Google Auth Callback Error:', error);
        return res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
});

export default router;

