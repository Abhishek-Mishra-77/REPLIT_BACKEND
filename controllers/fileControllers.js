import File from "../models/fileModel.js";
import { isValidObjectId } from "../services/mongoIdValidation.js";
import Folder from "../models/folderModel.js";

/* -------------------------------------------------------------------------- */
/*                           CREATE FILE                                      */
/* -------------------------------------------------------------------------- */
const createFile = async (req, res) => {
    const { name, folderId, langauge } = req.body;
    const userId = req.userId;
    try {
        if (!name || !userId || !folderId || !langauge) return res.status(400).json({ message: "Name, user ID, folder ID and langauge are required" });

        if (!isValidObjectId(userId)) return res.status(400).json({ message: "Invalid user ID" });

        if (!isValidObjectId(folderId)) return res.status(400).json({ message: "Invalid folder ID" });

        const existingFile = await File.findOne({ name });

        if (existingFile) return res.status(400).json({ message: "File name already exists" });

        const existingFolder = await Folder.findById(folderId);

        if (!existingFolder) return res.status(400).json({ message: "Folder ID not found" });

        const newFile = new File({
            name,
            userId,
            folderId,
            langauge
        });

        await newFile.save();
        res.status(201).json({ message: "File created successfully", file: newFile });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/* -------------------------------------------------------------------------- */
/*                           GET ALL FILES                                    */
/* -------------------------------------------------------------------------- */
const getAllFilesByFolderId = async (req, res) => {
    const { folderId } = req.params;
    try {
        if (!isValidObjectId(folderId)) return res.status(400).json({ message: "Invalid folder ID" });

        const files = await File.find({ folderId });
        res.status(200).json({ files });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/* -------------------------------------------------------------------------- */
/*                           GET FILE                                         */
/* -------------------------------------------------------------------------- */
const getFileById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid file ID" });

        const file = await File.findById(id);

        if (!file) return res.status(404).json({ message: "File not found" });

        res.status(200).json({ file });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/* -------------------------------------------------------------------------- */
/*                           REMOVE FILE                                      */
/* -------------------------------------------------------------------------- */
const removeFile = async (req, res) => {
    const { id } = req.params;
    try {
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid file ID" });

        await File.findByIdAndDelete(id);
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/* -------------------------------------------------------------------------- */
/*                           UPDATE FILE                                      */
/* -------------------------------------------------------------------------- */
const updateFile = async (req, res) => {
    const { id } = req.params;
    const { name, folderId, langauge } = req.body;
    try {
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid file ID" });

        const file = await File.findById(id);

        if (!file) return res.status(404).json({ message: "File not found" });

        if (name) file.name = name;
        if (folderId) file.folderId = folderId;
        if (langauge) file.langauge = langauge;

        await file.save();
        res.status(200).json({ message: "File updated successfully", file });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export { createFile, getAllFilesByFolderId, getFileById, removeFile, updateFile }
