"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const profile_1 = __importDefault(require("./profile"));
const trainings_1 = __importDefault(require("./trainings"));
const evaluations_1 = __importDefault(require("./evaluations"));
const documents_1 = __importDefault(require("./documents"));
const messages_1 = __importDefault(require("./messages"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateUser);
router.use((0, authMiddleware_1.requireRole)(['player']));
router.get('/', (req, res) => {
    res.json({
        message: 'Player App API',
        user: req.user,
        endpoints: {
            profile: '/api/player/profile',
            trainings: '/api/player/trainings',
            evaluations: '/api/player/evaluations',
            documents: '/api/player/documents',
            messages: '/api/player/messages',
        },
    });
});
router.use('/profile', profile_1.default);
router.use('/trainings', trainings_1.default);
router.use('/evaluations', evaluations_1.default);
router.use('/documents', documents_1.default);
router.use('/messages', messages_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map