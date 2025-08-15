import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (req.body && Object.keys(req.body).length > 0) {
        schema.parse(req.body);
      }
      
      // Validate query parameters
      if (req.query && Object.keys(req.query).length > 0) {
        schema.parse(req.query);
      }
      
      // Validate URL parameters
      if (req.params && Object.keys(req.params).length > 0) {
        schema.parse(req.params);
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Internal validation error',
      });
    }
  };
} 