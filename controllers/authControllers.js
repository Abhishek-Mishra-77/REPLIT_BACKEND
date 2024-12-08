import User from "./../models/authModels.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/generateToken.js";

/* -------------------------------------------------------------------------- */
/*                           CREATE USER                                      */
/* -------------------------------------------------------------------------- */
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, permissions } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            permissions
        });

        await newUser.save();

        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* -------------------------------------------------------------------------- */
/*                           UPDATE USER                                      */
/* -------------------------------------------------------------------------- */
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* -------------------------------------------------------------------------- */
/*                           REMOVE USER                                      */
/* -------------------------------------------------------------------------- */
const removeUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* -------------------------------------------------------------------------- */
/*                           GET USER BY ID                                   */
/* -------------------------------------------------------------------------- */
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* -------------------------------------------------------------------------- */
/*                           GET ALL USERS                                    */
/* -------------------------------------------------------------------------- */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* -------------------------------------------------------------------------- */
/*                           LOGIN USER                                       */
/* -------------------------------------------------------------------------- */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* -------------------------------------------------------------------------- */
/*                           TOKEN VERIFICATION                               */
/* -------------------------------------------------------------------------- */
const tokenVerification = async (req, res) => {
    try {

        if (!req.userId) {
            return res.status(400).json({ message: "Invalid token or user not authenticated" });
        }

        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.status(200).json({
            message: "Token is valid", user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export { createUser, updateUser, removeUser, getUserById, getAllUsers, loginUser, tokenVerification };
