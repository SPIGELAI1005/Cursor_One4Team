"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const members_1 = __importDefault(require("./members"));
const settings_1 = __importDefault(require("./settings"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateUser);
router.use((0, authMiddleware_1.requireRole)(['admin']));
router.get('/', (req, res) => {
    res.json({
        message: 'Admin Dashboard API',
        user: req.user,
        endpoints: {
            members: '/api/admin/members',
            settings: '/api/admin/settings',
            users: '/api/admin/users',
            reports: '/api/admin/reports',
        },
    });
});
router.use('/members', members_1.default);
router.use('/settings', settings_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map