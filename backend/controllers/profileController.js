import User from '../models/User.js';
import helpers from '../utils/helpers.js';
import constants from '../utils/constants.js';
import asyncHandler from '../utils/asyncHandler.js';
import errorHandler from '../middleware/errorHandler.js';

const { createResponse, sanitizeUser } = helpers;
const { HTTP_STATUS } = constants;
const { APIError } = errorHandler;

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!user) {
    throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'Profile retrieved successfully', sanitizeUser(user))
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user._id;

  // Find current user
  let user = await User.findById(userId);

  if (!user) {
    throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check email uniqueness if being updated
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError('Email already registered', HTTP_STATUS.CONFLICT);
    }
  }

  // Build update object - users can only update name, email, and password
  const updateData = {
    updatedBy: userId,
  };

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = password;

  // Update user
  user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'Profile updated successfully', sanitizeUser(user))
  );
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!currentPassword || !newPassword) {
    throw new APIError('Please provide current password and new password', HTTP_STATUS.BAD_REQUEST);
  }

  // Validate new password length
  if (newPassword.length < 8) {
    throw new APIError('New password must be at least 8 characters long', HTTP_STATUS.BAD_REQUEST);
  }

  // Get user with password
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new APIError('Current password is incorrect', HTTP_STATUS.UNAUTHORIZED);
  }

  // Update password
  user.password = newPassword;
  user.updatedBy = userId;
  await user.save();

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'Password changed successfully')
  );
});

export default {
  getProfile,
  updateProfile,
  changePassword,
};

