"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const players_1 = __importDefault(require("./players"));
const classes_1 = __importDefault(require("./classes"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateUser);
router.use((0, authMiddleware_1.requireRole)(['admin', 'trainer']));
router.get('/', (req, res) => {
    res.json({
        message: 'Trainer Dashboard API',
        user: req.user,
        endpoints: {
            players: '/api/trainer/players',
            classes: '/api/trainer/classes',
            reports: '/api/trainer/reports',
        },
    });
});
router.use('/players', players_1.default);
router.use('/classes', classes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map