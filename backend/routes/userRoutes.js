import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import constants from '../utils/constants.js';
import validationMiddleware from '../middleware/validation.js';

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
} = userController;

const { 
  protect, 
  authorize, 
  checkUserAccess, 
  canModifyRole
} = authMiddleware;

const { ROLES } = constants;

const {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
  validateUserQuery,
} = validationMiddleware;

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.USER),
  validateUserQuery,
  getUsers
);

router.get(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.USER),
  validateUserId,
  checkUserAccess,
  getUser
);

router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  validateCreateUser,
  createUser
);

router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  validateUpdateUser,
  checkUserAccess,
  canModifyRole,
  updateUser
);

router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  validateUserId,
  checkUserAccess,
  deleteUser
);

router.put(
  '/:id/restore',
  authorize(ROLES.ADMIN),
  validateUserId,
  checkUserAccess,
  restoreUser
);

export default router;

