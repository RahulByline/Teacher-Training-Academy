import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateUser } from '../controllers/userController.js';
import { authenticateUserOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authenticateUserOrAdmin, getCurrentUser);
router.put('/profile', authenticateUserOrAdmin, updateUser);

export default router;