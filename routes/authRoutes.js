import express from "express";
const router = express.Router();

import {
    createUser,
    updateUser,
    removeUser,
    getUserById,
    getAllUsers
} from "../controllers/authControllers.js";

router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', removeUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);

export default router;