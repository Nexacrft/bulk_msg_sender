import express from 'express';
import { createGroup, getGroups, sendGroupEmail } from '../controllers/groupEmail.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.post('/create', createGroup);
router.get('/', getGroups);
router.post('/send', sendGroupEmail);

export default router;
