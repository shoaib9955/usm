import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import validationMiddleware from '../middleware/validation.js';

const { login, refreshToken, getMe, logout } = authController;
const { protect } = authMiddleware;
const { validateLogin } = validationMiddleware;

const router = express.Router();

router.post('/login', validateLogin, login);

router.post('/refresh', refreshToken);

router.get('/me', protect, getMe);

router.post('/logout', protect, logout);

export default router;

