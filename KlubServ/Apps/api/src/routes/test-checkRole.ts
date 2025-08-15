import { Router, Request, Response } from 'express';
import { checkRole } from '../middleware/authMiddleware';

const router = Router();

/**
 * Example routes demonstrating checkRole middleware usage
 */

// Route accessible only to admins
router.get('/admin-only', 
  checkRole(['admin']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'Admin access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

// Route accessible to both admins and trainers
router.get('/admin-trainer', 
  checkRole(['admin', 'trainer']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'Admin or Trainer access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

// Route accessible to all authenticated users (admin, trainer, member)
router.get('/all-users', 
  checkRole(['admin', 'trainer', 'member']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'All users access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

// Route accessible only to trainers
router.get('/trainer-only', 
  checkRole(['trainer']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'Trainer access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

// Route accessible only to members
router.get('/member-only', 
  checkRole(['member']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'Member access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

export default router; 