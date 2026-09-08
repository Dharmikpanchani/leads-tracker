import express from 'express';
import authRoutes from './auth.routes.js';
import leadRoutes from './lead.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Leads Tracker API',
  });
});

export default router;
