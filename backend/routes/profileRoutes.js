import express from 'express';
import profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/auth.js';
import validationMiddleware from '../middleware/validation.js';

const {
  getProfile,
  updateProfile,
  changePassword,
} = profileController;

const { protect } = authMiddleware;
const { validateProfileUpdate } = validationMiddleware;

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getProfile);

router.put('/', validateProfileUpdate, updateProfile);

router.put('/change-password', changePassword);

export default router;

