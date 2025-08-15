"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const profile_1 = __importDefault(require("./profile"));
const payments_1 = __importDefault(require("./payments"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateUser);
router.use((0, authMiddleware_1.requireRole)(['admin', 'trainer', 'member']));
router.get('/', (req, res) => {
    res.json({
        message: 'Member App API',
        user: req.user,
        endpoints: {
            profile: '/api/member/profile',
            payments: '/api/member/payments',
            classes: '/api/member/classes',
            schedule: '/api/member/schedule',
        },
    });
});
router.use('/profile', profile_1.default);
router.use('/payments', payments_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map