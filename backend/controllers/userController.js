import User from '../models/User.js';
import helpers from '../utils/helpers.js';
import constants from '../utils/constants.js';
import asyncHandler from '../utils/asyncHandler.js';
import errorHandler from '../middleware/errorHandler.js';

const {
  createResponse,
  sanitizeUser,
  parsePagination,
  createPaginationMeta,
  buildFilterQuery,
  hasRoleOrHigher,
} = helpers;
const { HTTP_STATUS, ROLES, USER_STATUS } = constants;
const { APIError } = errorHandler;

const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  // Build filter query
  const allowedFilterFields = ['role', 'status', 'search'];
  let filter = buildFilterQuery(req.query, allowedFilterFields);

  // Managers can only see non-admin users
  if (req.user.role === ROLES.MANAGER) {
    filter.role = { $ne: ROLES.ADMIN };
  }

  // Execute query with pagination
  const [users, total] = await Promise.all([
    User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email'),
    User.countDocuments(filter),
  ]);

  // Sanitize user data (remove passwords)
  const sanitizedUsers = users.map((user) => sanitizeUser(user));

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'Users retrieved successfully', sanitizedUsers, {
      pagination: createPaginationMeta(page, limit, total),
    })
  );
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!user) {
    throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Manager cannot view admin users
  if (req.user.role === ROLES.MANAGER && user.role === ROLES.ADMIN) {
    throw new APIError('Not authorized to view admin users', HTTP_STATUS.FORBIDDEN);
  }

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'User retrieved successfully', sanitizeUser(user))
  );
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, status } = req.body;

  // Non-admins cannot create admin users
  if (role === ROLES.ADMIN && req.user.role !== ROLES.ADMIN) {
    throw new APIError('Only admins can create admin users', HTTP_STATUS.FORBIDDEN);
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError('Email already registered', HTTP_STATUS.CONFLICT);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || ROLES.USER,
    status: status || USER_STATUS.ACTIVE,
    createdBy: req.user._id,
  });

  res.status(HTTP_STATUS.CREATED).json(
    createResponse(true, 'User created successfully', sanitizeUser(user))
  );
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, status } = req.body;

  // Find user
  let user = await User.findById(id);

  if (!user) {
    throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check if trying to update an admin user
  if (user.role === ROLES.ADMIN && req.user.role !== ROLES.ADMIN) {
    throw new APIError('Not authorized to update admin users', HTTP_STATUS.FORBIDDEN);
  }

  // Check email uniqueness if being updated
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError('Email already registered', HTTP_STATUS.CONFLICT);
    }
  }

  // Build update object
  const updateData = {
    updatedBy: req.user._id,
  };

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = password;
  if (role) updateData.role = role;
  if (status) updateData.status = status;

  // Update user
  user = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'User updated successfully', sanitizeUser(user))
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    throw new APIError('Cannot delete your own account', HTTP_STATUS.BAD_REQUEST);
  }

  // Prevent deleting the last admin
  if (user.role === ROLES.ADMIN) {
    const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
    if (adminCount <= 1) {
      throw new APIError('Cannot delete the last admin user', HTTP_STATUS.BAD_REQUEST);
    }
  }

  // Soft delete user
  await user.softDelete();

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'User deleted successfully')
  );
});

const restoreUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new APIError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.status !== USER_STATUS.INACTIVE) {
    throw new APIError('User is not deleted', HTTP_STATUS.BAD_REQUEST);
  }

  // Restore user
  await user.restore();

  res.status(HTTP_STATUS.OK).json(
    createResponse(true, 'User restored successfully', sanitizeUser(user))
  );
});

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
};

