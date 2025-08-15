"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middleware/auth");
const contributions_1 = __importDefault(require("./contributions"));
const invoices_1 = __importDefault(require("./invoices"));
const payments_1 = __importDefault(require("./payments"));
const reports_1 = __importDefault(require("./reports"));
const integration_1 = __importDefault(require("./integration"));
const router = (0, express_1.Router)();
router.use((0, auth_1.requireRole)(['finance']));
router.use('/contributions', contributions_1.default);
router.use('/invoices', invoices_1.default);
router.use('/payments', payments_1.default);
router.use('/reports', reports_1.default);
router.use('/integration', integration_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map