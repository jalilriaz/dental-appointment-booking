"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/notifications
router.get('/', auth_middleware_1.requireAuth, (_req, res) => {
    return res.json({ notifications: [] });
});
// PATCH /api/notifications/:id
router.patch('/:id', auth_middleware_1.requireAuth, (_req, res) => {
    return res.json({ success: true, notification: null });
});
exports.default = router;
//# sourceMappingURL=notifications.routes.js.map