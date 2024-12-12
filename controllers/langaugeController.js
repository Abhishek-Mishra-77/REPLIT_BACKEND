import Langauge from "../models/langaugeModel.js";

/* -------------------------------------------------------------------------- */
/*                           CREATE LANGAUGE                                  */
/* -------------------------------------------------------------------------- */
const createLangauge = async (req, res) => {
    const { name, logo } = req.body;
    try {

        if (!name) return res.status(400).json({ message: "Name is required" });

        const existingLangauge = await Langauge.findOne({ name });

        if (existingLangauge) return res.status(400).json({ message: "Langauge already exists" });

        const newLangauge = new Langauge({ name, logo });

        await newLangauge.save();

        res.status(201).json({ message: "Langauge created successfully", langauge: newLangauge });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/* -------------------------------------------------------------------------- */
/*                           REMOVE LANGAUGE                                  */
/* -------------------------------------------------------------------------- */
const removeLangauge = async (req, res) => {
}

/* -------------------------------------------------------------------------- */
/*                           UPDATE LANGAUGE                                  */
/* -------------------------------------------------------------------------- */
const updateLangauge = async (req, res) => { }

/* -------------------------------------------------------------------------- */
/*                           GET LANGAUGE                                     */
/* -------------------------------------------------------------------------- */
const getLangaugeById = async (req, res) => { }

/* -------------------------------------------------------------------------- */
/*                           GET ALL LANGAUGES                                */
/* -------------------------------------------------------------------------- */
const getAllLangauges = async (req, res) => {
    try {
        const langauges = await Langauge.find();
        res.status(200).json({ langauges });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export { createLangauge, removeLangauge, updateLangauge, getLangaugeById, getAllLangauges }