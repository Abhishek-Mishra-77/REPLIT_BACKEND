import express from "express";
const router = express.Router();
import { createFolder, updateFolder, removeFolder, getFolderById, getAllFoldersByUserId } from '../controllers/folderControllers.js';

import authMiddleware from "../middlewares/authMiddleware.js";

/* -------------------------------------------------------------------------- */
/*                                 FOLDER ROUTES                              */
/* -------------------------------------------------------------------------- */

router.post('/create', authMiddleware, createFolder);
router.put('/update/:id', authMiddleware, updateFolder);
router.delete('/remove/:id', authMiddleware, removeFolder);
router.get('/folder/:id', authMiddleware, getFolderById);
router.get('/folders/:userId', authMiddleware, getAllFoldersByUserId);

export default router;