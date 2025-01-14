import express from "express";
const router = express.Router();

import { createLangauge, removeLangauge, updateLangauge, getLangaugeById, getAllLangauges } from "../controllers/langaugeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

/* -------------------------------------------------------------------------- */
/*                                 LANGAUGE ROUTES                            */
/* -------------------------------------------------------------------------- */

router.post('/create', authMiddleware, createLangauge);
router.put('/update/:id', authMiddleware, updateLangauge);
router.delete('/remove/:id', authMiddleware, removeLangauge);
router.get('/langauge/:id', authMiddleware, getLangaugeById);
router.get('/langauges', authMiddleware, getAllLangauges);

export default router;