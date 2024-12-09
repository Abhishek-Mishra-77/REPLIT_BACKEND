import express from "express";
const router = express.Router();

import {
    createUser,
    updateUser,
    removeUser,
    getUserById,
    getAllUsers,
    loginUser,
    tokenVerification,
    verifyAndloginByOtp,
    sendOtpToEmailForLogin
} from "../controllers/authControllers.js";

import authMiddleware from "../middlewares/authMiddleware.js";

/* -------------------------------------------------------------------------- */
/*                                 AUTH ROUTES                                */
/* -------------------------------------------------------------------------- */

router.post('/create', createUser);
router.post('/verifybyotp', verifyAndloginByOtp);
router.post('/sendotp', sendOtpToEmailForLogin);
router.post('/verify-token', authMiddleware, tokenVerification);
router.post('/login', loginUser);
router.put('/update/:id', authMiddleware, updateUser);
router.delete('/remove/:id', authMiddleware, removeUser);
router.get('/user/:id', authMiddleware, getUserById);
router.get('/users', authMiddleware, getAllUsers);

export default router;