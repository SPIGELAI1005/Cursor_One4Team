import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '@/lib/env';

// Load environment variables
dotenv.config();

const app = express();
const PORT = env.PORT;

// Security middleware
app.use(helmet());
app.set('trust proxy', 1);
app.use(cors({
  origin: env.NEXT_PUBLIC_APP_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple test endpoint
app.get('/', (_req, res) => {
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

// Swagger configuration
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
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV
  });
});

// API routes
app.get('/api', (_req, res) => {
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

// Import and use route modules
import protectedRoutes from './routes';

// Mount protected API routes
app.use('/api', protectedRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
     message: env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: ['/', '/health', '/api', '/api-docs']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 One4Team API server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/`);
});

export default app; 