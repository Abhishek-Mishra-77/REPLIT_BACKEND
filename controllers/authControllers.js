import User from "./../models/authModels.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/generateToken.js";
import { isValidObjectId } from "../services/mongoIdValidation.js";
import Otp from "./../models/authOtp.js";
import sendOTPToEmail from "../services/onEmailSendHandler.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

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

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

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
        const { id } = req.params;
        console.log(id)
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findByIdAndDelete(id);

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

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

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

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const users = await User.find().select('-password');
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

        if (!isValidObjectId(req.userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
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

/* -------------------------------------------------------------------------- */
/*                           OTP VERIFICATION                                 */
/* -------------------------------------------------------------------------- */

const verifyAndLoginByOtp = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ message: "Username and OTP are required" });
    }

    try {
        // Validate the user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const otpRecord = await Otp.findOne({ user: userId, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (otpRecord.attempts >= 3) {
            await Otp.deleteMany({ user: userId });
            await User.deleteOne({ _id: userId });
            return res.status(400).json({ message: "Maximum attempts exceeded. OTPs and user account deleted." });
        }

        if (otpRecord.expiresAt < Date.now()) {
            await Otp.deleteMany({ user: userId });
            await User.deleteOne({ _id: userId });
            return res.status(400).json({ message: "OTP has expired. OTPs and user account deleted." });
        }

        // OTP is correct, proceed to generate the JWT token
        if (otpRecord.otp === otp) {
            // Generate the JWT token
            const user = await User.findById(userId);

            const token = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            // Delete all OTP records and the user after successful verification and token generation
            await Otp.deleteMany({ user: userId });  // Delete all OTP records for the user

            return res.status(200).json({
                message: "OTP verified successfully",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
            });
        } else {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: "Failed to verify OTP", error: error.message });
    }
};
/* -------------------------------------------------------------------------- */
/*                           SEND OTP TO EMAIL                                */
/* -------------------------------------------------------------------------- */
const sendOtpToEmailForLogin = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up first." });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await sendOTPToEmail(email, otpCode);

        await Otp.create({
            user: user._id,
            otp: otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000,
            otpAttempts: 0
        });

        res.status(200).json({ message: "OTP sent to your email.", userId: user._id });
    }
    catch (error) {
        return res.status()

    }
}

export {
    createUser,
    updateUser,
    removeUser,
    getUserById,
    getAllUsers,
    loginUser,
    tokenVerification,
    sendOtpToEmailForLogin,
    verifyAndLoginByOtp
};
