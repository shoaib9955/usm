import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import helpers from '../utils/helpers.js';
import constants from '../utils/constants.js';
import asyncHandler from '../utils/asyncHandler.js';

const { createResponse, sanitizeUser } = helpers;
const { HTTP_STATUS, USER_STATUS } = constants;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createResponse(false, 'Please provide email and password')
    );
  }

  // Find user by email and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createResponse(false, 'Account not found with this email')
    );
  }

  // Check if user is active (not soft deleted)
  if (user.status === USER_STATUS.INACTIVE) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createResponse(false, 'Account is inactive. Please contact administrator.')
    );
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createResponse(false, 'Incorrect password. Please try again.')
    );
  }

  // Generate tokens
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Return user data and tokens
  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'Login successful', {
      user: sanitizeUser(user),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRE || '24h',
      },
    })
  );
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createResponse(false, 'Refresh token is required')
    );
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createResponse(false, 'Invalid or expired refresh token')
    );
  }

  // Check if user exists and is active
  const user = await User.findById(decoded.id);

  if (!user || user.status === USER_STATUS.INACTIVE) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createResponse(false, 'User not found or inactive')
    );
  }

  // Generate new access token
  const accessToken = generateToken(user._id);

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'Token refreshed successfully', {
      accessToken,
      expiresIn: process.env.JWT_EXPIRE || '24h',
    })
  );
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createResponse(false, 'User not found')
    );
  }

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'User retrieved successfully', {
      user: sanitizeUser(user),
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT setup, logout is mainly handled client-side
  // by removing the token from storage
  // Optionally, you could implement a token blacklist here

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'Logged out successfully')
  );
});

export default {
  login,
  refreshToken,
  getMe,
  logout,
  generateToken,
  generateRefreshToken,
};

