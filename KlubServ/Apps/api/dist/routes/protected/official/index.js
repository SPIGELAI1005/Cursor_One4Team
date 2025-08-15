"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const announcements_1 = __importDefault(require("./announcements"));
const events_1 = __importDefault(require("./events"));
const staff_1 = __importDefault(require("./staff"));
const documents_1 = __importDefault(require("./documents"));
const router = (0, express_1.Router)();
router.use((0, authMiddleware_1.requireRole)(['official']));
router.use('/announcements', announcements_1.default);
router.use('/events', events_1.default);
router.use('/staff', staff_1.default);
router.use('/documents', documents_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map