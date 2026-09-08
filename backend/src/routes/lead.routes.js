import express from 'express';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
  bulkCreateLeads,
} from '../controller/LeadController.js';
import {
  getNotesByLead,
  createNote,
  deleteNote,
} from '../controller/NoteController.js';
import { validateRequest } from '../middleware/Validator.js';
import {
  createLeadSchema,
  updateLeadSchema,
  createNoteSchema,
} from '../utils/Validation.js';
import { authMiddleware } from '../middleware/Auth.js';
import { apiLimiter } from '../middleware/RateLimit.js';

const router = express.Router();

// Apply api limiter to lead routes
router.use(apiLimiter);

// Protected routes (require valid JWT accessToken)
router.get('/stats', authMiddleware, getLeadStats);
router.post('/bulk', authMiddleware, bulkCreateLeads);

// Main Leads CRUD
router.get('/', authMiddleware, getAllLeads);
router.post('/', authMiddleware, validateRequest(createLeadSchema), createLead);
router.get('/:id', authMiddleware, getLeadById);
router.patch('/:id', authMiddleware, validateRequest(updateLeadSchema), updateLead);
router.delete('/:id', authMiddleware, deleteLead);

// Lead Notes Sub-routes
router.get('/:id/notes', authMiddleware, getNotesByLead);
router.post('/:id/notes', authMiddleware, validateRequest(createNoteSchema), createNote);
router.delete('/:id/notes/:noteId', authMiddleware, deleteNote);

export default router;
