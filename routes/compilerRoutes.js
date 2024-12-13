import express from 'express';
const router = express.Router();

import { onCompileCodeHandler } from '../controllers/compilerController.js';

router.post('/compile', onCompileCodeHandler)

export default router;