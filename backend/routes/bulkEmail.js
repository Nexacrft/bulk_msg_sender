import express from 'express';
import { sendBulkEmail, getEmailHistory, getEmailDetails } from '../controllers/bulkEmail.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Send bulk email
router.post('/send-bulk', sendBulkEmail);

// Get email history
router.get('/history', getEmailHistory);

// Get email details by ID
router.get('/:id', getEmailDetails);

export default router;
