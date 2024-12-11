import express from "express";
const router = express.Router();

import { createLangauge, removeLangauge, updateLangauge, getLangaugeById, getAllLangauges } from "../controllers/langaugeController.js";


/* -------------------------------------------------------------------------- */
/*                                 LANGAUGE ROUTES                            */
/* -------------------------------------------------------------------------- */

router.post('/create', createLangauge);
router.put('/update/:id', updateLangauge);
router.delete('/remove/:id', removeLangauge);
router.get('/langauge/:id', getLangaugeById);
router.get('/langauges', getAllLangauges);

export default router;