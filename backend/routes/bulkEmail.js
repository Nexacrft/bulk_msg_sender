import express from 'express';
import { sendBulkEmail } from '../controllers/bulkEmail.js';

const router = express.Router();

// Send bulk email
router.post('/send-bulk', sendBulkEmail);

// Get email status

export default router;
