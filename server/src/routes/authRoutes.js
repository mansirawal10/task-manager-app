import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getUsers } from '../controllers/userController.js'; 

const router = express.Router();

router.get('/', getUsers);

// POST request for registering a user
router.post('/register', registerUser);

// POST request for logging in a user
router.post('/login', loginUser);

export default router;
