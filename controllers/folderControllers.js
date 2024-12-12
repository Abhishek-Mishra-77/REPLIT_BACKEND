import Folder from "../models/folderModel.js";
import User from '../models/authModels.js';
import File from '../models/fileModel.js';
import { isValidObjectId } from "../services/mongoIdValidation.js";

/* -------------------------------------------------------------------------- */
/*                           CREATE FOLDER                                    */
/* -------------------------------------------------------------------------- */
const createFolder = async (req, res) => {
    const { name } = req.body;
    try {

        if (!name || !req.userId) return res.status(400).json({ message: "Name and user ID are required" });

        if (!isValidObjectId(req.userId)) return res.status(400).json({ message: "Invalid user ID" });

        const existingFolder = await Folder.findOne({ name });

        if (existingFolder) return res.status(400).json({ message: "Folder already exists" });

        if (!await User.findById(req.userId)) return res.status(400).json({ message: "User ID not found" });

        const newFolder = new Folder({
            name,
            userId: req.userId,
        });

        await newFolder.save();
        res.status(201).json({ message: "Folder created successfully", folder: newFolder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/* -------------------------------------------------------------------------- */
/*                           UPDATE FOLDER                                    */
/* -------------------------------------------------------------------------- */
const updateFolder = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid folder ID" });

        const folder = await Folder.findById(id);

        if (!folder) return res.status(404).json({ message: "Folder not found" });

        folder.name = name;

        await folder.save();
        res.status(200).json({ message: "Folder updated successfully", folder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/* -------------------------------------------------------------------------- */
/*                           REMOVE FOLDER                                    */
/* -------------------------------------------------------------------------- */
const removeFolder = async (req, res) => {
    const { id } = req.params;
    try {
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid folder ID" });

        await Folder.findByIdAndDelete(id);
        res.status(200).json({ message: "Folder deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/* -------------------------------------------------------------------------- */
/*                           GET FOLDER                                       */
/* -------------------------------------------------------------------------- */
const getFolderById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid folder ID" });
        }

        const folder = await Folder.findById(id);
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const deleteFilesResult = await File.deleteMany({ folderId: id });
        console.log(`Deleted ${deleteFilesResult.deletedCount} files related to folder ${id}`);

        await Folder.findByIdAndDelete(id);
        console.log(`Deleted folder with ID ${id}`);

        // Respond with success
        res.status(200).json({ message: `Folder and ${deleteFilesResult.deletedCount} associated files deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* -------------------------------------------------------------------------- */
/*                           GET ALL FOLDERS                                  */
/* -------------------------------------------------------------------------- */
const getAllFoldersByUserId = async (req, res) => {
    const userId = req.userId;
    try {
        if (!isValidObjectId(userId)) return res.status(400).json({ message: "Invalid user ID" });

        const folders = await Folder.find({ userId });
        res.status(200).json({ folders });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export { createFolder, updateFolder, removeFolder, getFolderById, getAllFoldersByUserId }