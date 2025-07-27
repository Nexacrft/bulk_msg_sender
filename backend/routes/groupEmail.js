import express from 'express';
import { createGroup, getGroups, sendGroupEmail } from '../controllers/groupEmail.js';

const router = express.Router();

router.post('/create', createGroup);
router.get('/', getGroups);
router.post('/send', sendGroupEmail);

export default router;
