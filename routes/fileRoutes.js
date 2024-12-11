import express from "express";
const router = express.Router();

import { createFile, getAllFilesByFolderId, getFileById, removeFile, updateFile } from "../controllers/fileControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";


/* -------------------------------------------------------------------------- */
/*                                 FILE ROUTES                                */
/* -------------------------------------------------------------------------- */

router.post('/create', authMiddleware, createFile);
router.put('/update/:id', authMiddleware, updateFile);
router.delete('/remove/:id', authMiddleware, removeFile);
router.get('/file/:id', authMiddleware, getFileById);
router.get('/files/:folderId', authMiddleware, getAllFilesByFolderId);

export default router;