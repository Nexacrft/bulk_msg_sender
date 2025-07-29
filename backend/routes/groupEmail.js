import express from 'express';
import { 
  createGroup, 
  getGroups, 
  sendGroupEmail,
  getGroupEmailHistory 
} from '../controllers/groupEmail.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Group management
router.post('/create', createGroup);
router.get('/', getGroups);
router.post('/send', sendGroupEmail);

// Email history
router.get('/history/:groupId', getGroupEmailHistory);
router.get('/:groupId/history', getGroupEmailHistory);  // Alternative path format

export default router;

