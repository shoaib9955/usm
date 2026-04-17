import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import helpers from '../utils/helpers.js';
import constants from '../utils/constants.js';
import asyncHandler from '../utils/asyncHandler.js';
import errorHandler from './errorHandler.js';

const { createResponse } = helpers;
const { HTTP_STATUS, ROLES } = constants;
const { APIError } = errorHandler;

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    throw new APIError('Not authorized to access this route', HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (include password)
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      throw new APIError('User not found', HTTP_STATUS.UNAUTHORIZED);
    }

    // Check if user is active (using status from constants/model)
    // Note: The previous code used user.isActive, but the model has user.status
    if (user.status === 'inactive') {
      throw new APIError('Account is inactive. Please contact administrator.', HTTP_STATUS.UNAUTHORIZED);
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Not authorized to access this route', HTTP_STATUS.UNAUTHORIZED);
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new APIError('Not authorized to access this route', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      throw new APIError(`Role ${req.user.role} is not authorized to access this route`, HTTP_STATUS.FORBIDDEN);
    }

    next();
  };
};

const checkUserAccess = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user;

  // Admin has full access
  if (currentUser.role === ROLES.ADMIN) {
    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    req.targetUser = targetUser;
    return next();
  }

  // Manager can access non-admin users
  if (currentUser.role === ROLES.MANAGER) {
    const targetUser = await User.findById(id);

    if (!targetUser) {
      throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Manager cannot access admin users
    if (targetUser.role === ROLES.ADMIN) {
      throw new APIError('Not authorized to access admin users', HTTP_STATUS.FORBIDDEN);
    }

    req.targetUser = targetUser;
    return next();
  }

  // Regular user can only access own profile
  if (currentUser._id.toString() !== id) {
    throw new APIError('Not authorized to access this user profile', HTTP_STATUS.FORBIDDEN);
  }

  const targetUser = await User.findById(id);
  req.targetUser = targetUser;
  next();
});

const canModifyRole = (req, res, next) => {
  if (req.body.role && req.user.role !== ROLES.ADMIN) {
    // If user is manager, they can't assign ADMIN role
    if (req.body.role === ROLES.ADMIN) {
      throw new APIError('Only admins can assign the admin role', HTTP_STATUS.FORBIDDEN);
    }
  }
  next();
};

export default {
  protect,
  authorize,
  checkUserAccess,
  canModifyRole,
};

