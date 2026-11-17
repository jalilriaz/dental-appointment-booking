"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const googleapis_1 = require("googleapis");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const email_1 = require("../lib/email");
const auth_middleware_1 = require("../middleware/auth.middleware");
const googleCalendar_1 = require("../lib/googleCalendar");
const router = (0, express_1.Router)();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(150),
    password: zod_1.z.string().min(1).max(250),
});
const setupPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional().nullable(),
    dateOfBirth: zod_1.z.string().optional().nullable(),
    gender: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const parseResult = loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid email or password format' });
        }
        const { email, password } = parseResult.data;
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: normalizedEmail },
                    ...(normalizedEmail === 'admin@elitedental.com' ? [{ email: 'elitedental@centre.com' }] : []),
                    ...(normalizedEmail === 'elitedental@centre.com' ? [{ email: 'admin@elitedental.com' }] : []),
                ],
            },
        });
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isValid = await (0, auth_1.verifyPassword)(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        if (user.role === 'PATIENT') {
            return res.status(403).json({
                error: 'Patient web portal has moved to WhatsApp. Please message us on WhatsApp at +92 314 5475528 to manage your appointments.',
                code: 'PATIENT_PORTAL_DEPRECATED',
            });
        }
        const accessToken = await (0, auth_1.signAccessToken)({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        const refreshToken = await (0, auth_1.signRefreshToken)({
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
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});
// Helper to clear auth cookies with proper flags
const clearAuthCookies = (res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOpts = {
        path: '/',
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax'),
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
router.get('/logout', (_req, res) => {
    clearAuthCookies(res);
    return res.redirect('/');
});
// POST /api/auth/logout (Client API call)
router.post('/logout', (_req, res) => {
    clearAuthCookies(res);
    return res.json({ success: true, redirect: '/' });
});
// GET /api/auth/me
router.get('/me', auth_middleware_1.requireAuth, (req, res) => {
    return res.json({ user: req.user });
});
// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: normalizedEmail },
                    ...(normalizedEmail === 'admin@elitedental.com' ? [{ email: 'elitedental@centre.com' }] : []),
                    ...(normalizedEmail === 'elitedental@centre.com' ? [{ email: 'admin@elitedental.com' }] : []),
                ],
            },
        });
        if (!user) {
            return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });
        const appUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetLink = `${appUrl}/reset-password?token=${resetToken}`;
        const hasSmtp = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
        if (hasSmtp) {
            try {
                await (0, email_1.sendPasswordResetEmail)(user.email || email, resetLink);
            }
            catch (emailErr) {
                console.error('[FORGOT PASSWORD] Failed to send email via SMTP:', emailErr);
            }
        }
        else {
            console.log('\n======================================================');
            console.log(`[AUTH DEMO] Password reset link for ${user.email || email}:`);
            console.log(`${resetLink}`);
            console.log('======================================================\n');
        }
        return res.json({
            success: true,
            message: hasSmtp
                ? 'A secure reset link has been sent to your registered email address.'
                : 'Reset token generated. In demo mode (SMTP not configured), click the button below to proceed.',
            resetLink: hasSmtp ? undefined : resetLink,
            demoMode: !hasSmtp,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
});
// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and password are required' });
        }
        const user = await prisma_1.default.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        return res.json({ success: true, message: 'Password reset successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
});
// POST /api/auth/register-request
router.post('/register-request', async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing && existing.password) {
            return res.status(409).json({ error: 'This email is already registered. Please login instead.' });
        }
        const setupToken = crypto_1.default.randomBytes(32).toString('hex');
        const setupTokenExpiry = new Date(Date.now() + 24 * 3600000);
        if (existing) {
            await prisma_1.default.user.update({
                where: { email },
                data: {
                    name,
                    resetToken: setupToken,
                    resetTokenExpiry: setupTokenExpiry,
                },
            });
        }
        else {
            await prisma_1.default.user.create({
                data: {
                    name,
                    email,
                    resetToken: setupToken,
                    resetTokenExpiry: setupTokenExpiry,
                    role: 'PATIENT',
                },
            });
        }
        const appUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const setupLink = `${appUrl}/setup-password?token=${setupToken}`;
        try {
            await (0, email_1.sendAccountSetupEmail)(email, name, setupLink);
        }
        catch (emailErr) {
            console.error('[REGISTER REQUEST] Email send error:', emailErr);
        }
        return res.json({
            success: true,
            message: 'Registration request received. Please check your email to complete setup.',
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/auth/setup-password
router.post('/setup-password', async (req, res) => {
    try {
        const parseResult = setupPasswordSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid data format' });
        }
        const { token, password, phone, dateOfBirth, gender, address } = parseResult.data;
        const user = await prisma_1.default.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const updatedUser = await prisma_1.default.user.update({
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
        const accessToken = await (0, auth_1.signAccessToken)({
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
        });
        const refreshToken = await (0, auth_1.signRefreshToken)({
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
});
// GET /api/auth/google
router.get('/google', (_req, res) => {
    const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
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
router.get('/google/callback', async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).json({ error: 'Missing authorization code' });
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const token = (0, auth_middleware_1.extractToken)(req);
        let userId = null;
        let role = 'ADMIN';
        if (token) {
            try {
                const session = await (0, auth_1.decrypt)(token);
                userId = session.id;
                role = session.role;
            }
            catch (err) {
                console.warn('Session decrypt in google callback failed, using admin fallback:', err);
            }
        }
        if (!userId) {
            const adminUser = await prisma_1.default.user.findFirst({
                where: { role: 'ADMIN' },
                orderBy: { createdAt: 'asc' },
            });
            if (adminUser) {
                userId = adminUser.id;
                role = adminUser.role;
            }
        }
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: No admin account found to bind Google Calendar' });
        }
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                googleCalendarToken: JSON.stringify(tokens),
                googleCalendarRefreshToken: tokens.refresh_token || undefined,
                googleCalendarConnected: true,
            },
        });
        // Automatically sync any appointments (e.g. booked earlier before connecting) to Google Calendar
        (0, googleCalendar_1.syncUpcomingAppointmentsToGoogleCalendar)().catch((syncErr) => {
            console.error('[Google Calendar] Automatic post-connect sync error:', syncErr);
        });
        const appUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        if (role === 'ADMIN') {
            return res.redirect(`${appUrl}/admin/settings`);
        }
        else if (role === 'STAFF') {
            return res.redirect(`${appUrl}/staff`);
        }
        return res.redirect(`${appUrl}/`);
    }
    catch (error) {
        console.error('Google Auth Callback Error:', error);
        return res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map