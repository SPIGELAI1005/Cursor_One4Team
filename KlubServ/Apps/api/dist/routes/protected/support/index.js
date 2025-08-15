"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const users_1 = __importDefault(require("./users"));
const messages_1 = __importDefault(require("./messages"));
const flags_1 = __importDefault(require("./flags"));
const actions_1 = __importDefault(require("./actions"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateUser);
router.use((0, authMiddleware_1.requireRole)(['support']));
router.get('/', (req, res) => {
    res.json({
        message: 'Support Dashboard API',
        user: req.user,
        endpoints: {
            users: '/api/support/users',
            messages: '/api/support/messages',
            flags: '/api/support/flags',
            actions: '/api/support/actions',
        },
    });
});
router.use('/users', users_1.default);
router.use('/messages', messages_1.default);
router.use('/flags', flags_1.default);
router.use('/actions', actions_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map