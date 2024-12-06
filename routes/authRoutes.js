import express from "express";
const router = express.Router();

import {
    createUser,
    updateUser,
    removeUser,
    getUserById,
    getAllUsers,
    loginUser
} from "../controllers/authControllers.js";

router.post('/create', createUser);
router.post('/login', loginUser);
router.put('/update/:id', updateUser);
router.delete('/remove/:id', removeUser);
router.get('/user/:id', getUserById);
router.get('/users', getAllUsers);

export default router;