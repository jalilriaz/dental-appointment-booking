"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./lib/logger");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const treatments_routes_1 = __importDefault(require("./routes/treatments.routes"));
const appointments_routes_1 = __importDefault(require("./routes/appointments.routes"));
const patients_routes_1 = __importDefault(require("./routes/patients.routes"));
const patient_treatments_routes_1 = __importDefault(require("./routes/patient-treatments.routes"));
const staff_routes_1 = __importDefault(require("./routes/staff.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const bot_routes_1 = __importDefault(require("./routes/bot.routes"));
const cron_routes_1 = __importDefault(require("./routes/cron.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const feedback_routes_1 = __importDefault(require("./routes/feedback.routes"));
const medical_records_routes_1 = __importDefault(require("./routes/medical-records.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const doctors_routes_1 = __importDefault(require("./routes/doctors.routes"));
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '4000', 10);
// Allowed CORS origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
            callback(null, true); // Allow during dev, credentials enabled
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
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
app.use('/api/auth', auth_routes_1.default);
app.use('/api/treatments', treatments_routes_1.default);
app.use('/api/appointments', appointments_routes_1.default);
app.use('/api/patients', patients_routes_1.default);
app.use('/api/patient-treatments', patient_treatments_routes_1.default);
app.use('/api/staff', staff_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/bot', bot_routes_1.default);
app.use('/api/cron', cron_routes_1.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/notifications', notifications_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.use('/api/feedback', feedback_routes_1.default);
app.use('/api/medical-records', medical_records_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/doctors', doctors_routes_1.default);
// Centralized error handler
app.use(error_middleware_1.errorHandler);
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        logger_1.logger.info(`🚀 Dental Clinic Express API server listening on http://localhost:${port}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map