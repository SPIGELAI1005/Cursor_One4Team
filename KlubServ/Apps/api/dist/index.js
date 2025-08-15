"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({
        message: 'One4Team API is running!',
        timestamp: new Date().toISOString(),
        endpoints: {
            test: '/',
            health: '/health',
            api: '/api',
            docs: '/api-docs'
        }
    });
});
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'One4Team API',
            version: '1.0.0',
            description: 'Sports club management API',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.get('/api', (req, res) => {
    res.json({
        message: 'One4Team API is running!',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            docs: '/api-docs',
            admin: '/api/admin',
            trainer: '/api/trainer',
            member: '/api/member'
        },
        authentication: 'All /api/* routes require valid Clerk JWT token',
        roles: {
            admin: 'Full system access',
            trainer: 'Player and class management',
            member: 'Personal profile and payments'
        }
    });
});
const routes_1 = __importDefault(require("./routes"));
app.use('/api', routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        requestedUrl: req.originalUrl,
        availableEndpoints: ['/', '/health', '/api', '/api-docs']
    });
});
app.listen(PORT, () => {
    console.log(`🚀 One4Team API server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Test endpoint: http://localhost:${PORT}/`);
});
exports.default = app;
//# sourceMappingURL=index.js.map