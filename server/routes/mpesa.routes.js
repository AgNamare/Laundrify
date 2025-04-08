// routes/mpesa.routes.js
import express from 'express';
import { stkPush, handleCallback } from '../controllers/mpesa.controller.js';

const router = express.Router();

router.post('/stkpush', stkPush);
router.post('/callback', handleCallback);

export default router;
