"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/admin-only', (0, authMiddleware_1.checkRole)(['admin']), (req, res) => {
    res.json({
        message: 'Admin access granted',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
router.get('/admin-trainer', (0, authMiddleware_1.checkRole)(['admin', 'trainer']), (req, res) => {
    res.json({
        message: 'Admin or Trainer access granted',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
router.get('/all-users', (0, authMiddleware_1.checkRole)(['admin', 'trainer', 'member']), (req, res) => {
    res.json({
        message: 'All users access granted',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
router.get('/trainer-only', (0, authMiddleware_1.checkRole)(['trainer']), (req, res) => {
    res.json({
        message: 'Trainer access granted',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
router.get('/member-only', (0, authMiddleware_1.checkRole)(['member']), (req, res) => {
    res.json({
        message: 'Member access granted',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=test-checkRole.js.map