import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import treatmentsRoutes from './routes/treatments.routes';
import appointmentsRoutes from './routes/appointments.routes';
import patientsRoutes from './routes/patients.routes';
import patientTreatmentsRoutes from './routes/patient-treatments.routes';
import staffRoutes from './routes/staff.routes';
import adminRoutes from './routes/admin.routes';
import botRoutes from './routes/bot.routes';
import cronRoutes from './routes/cron.routes';
import inventoryRoutes from './routes/inventory.routes';
import notificationsRoutes from './routes/notifications.routes';
import settingsRoutes from './routes/settings.routes';
import feedbackRoutes from './routes/feedback.routes';
import medicalRecordsRoutes from './routes/medical-records.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
const port = parseInt(process.env.PORT || '4000', 10);

// Allowed CORS origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                callback(null, true);
            } else {
                callback(null, true); // Allow during dev, credentials enabled
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        exposedHeaders: ['Set-Cookie'],
    })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'dental-clinic-backend',
        port,
        timestamp: new Date().toISOString(),
    });
});

// Mount modular API routers
app.use('/api/auth', authRoutes);
app.use('/api/treatments', treatmentsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/patient-treatments', patientTreatmentsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/upload', uploadRoutes);

// Centralized error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        logger.info(`🚀 Dental Clinic Express API server listening on http://localhost:${port}`);
    });
}

export default app;

