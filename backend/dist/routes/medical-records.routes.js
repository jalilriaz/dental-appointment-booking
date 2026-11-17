"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/medical-records (Deprecated stub)
router.post('/', (_req, res) => {
    return res.status(410).json({
        error: 'Medical records feature has been removed from this version.',
    });
});
exports.default = router;
//# sourceMappingURL=medical-records.routes.js.map