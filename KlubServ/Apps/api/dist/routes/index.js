"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("./protected/admin"));
const trainer_1 = __importDefault(require("./protected/trainer"));
const member_1 = __importDefault(require("./protected/member"));
const support_1 = __importDefault(require("./protected/support"));
const official_1 = __importDefault(require("./protected/official"));
const player_1 = __importDefault(require("./protected/player"));
const finance_1 = __importDefault(require("./protected/finance"));
const test_checkRole_1 = __importDefault(require("./test-checkRole"));
const router = (0, express_1.Router)();
router.use('/admin', admin_1.default);
router.use('/trainer', trainer_1.default);
router.use('/member', member_1.default);
router.use('/support', support_1.default);
router.use('/official', official_1.default);
router.use('/player', player_1.default);
router.use('/finance', finance_1.default);
router.use('/test-checkRole', test_checkRole_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map