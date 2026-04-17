import constants from './constants.js';
const { PAGINATION, ROLE_HIERARCHY } = constants;

const createResponse = (success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  );

  return { page, limit, skip: (page - 1) * limit };
};

const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const sanitizeUser = (user) => {
  if (!user) return null;

  // Convert Mongoose document to plain object if needed
  const userObj = user.toObject ? user.toObject() : user;

  // eslint-disable-next-line no-unused-vars
  const { password, __v, ...sanitizedUser } = userObj;

  return sanitizedUser;
};

const buildFilterQuery = (query, allowedFields) => {
  const filter = {};

  allowedFields.forEach((field) => {
    if (query[field] !== undefined && query[field] !== '') {
      // Handle search for string fields
      if (field === 'search') {
        filter.$or = [
          { name: { $regex: query[field], $options: 'i' } },
          { email: { $regex: query[field], $options: 'i' } },
        ];
      } else {
        filter[field] = query[field];
      }
    }
  });

  return filter;
};

const hasRoleOrHigher = (userRole, requiredRole) => {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);

  if (userRoleIndex === -1 || requiredRoleIndex === -1) {
    return false;
  }

  return userRoleIndex >= requiredRoleIndex;
};

const validateEnv = (requiredVars) => {
  const missingVars = requiredVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0) {
    throw new Error(
      `CRITICAL ERROR: Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

export default {
  createResponse,
  parsePagination,
  createPaginationMeta,
  sanitizeUser,
  buildFilterQuery,
  hasRoleOrHigher,
  validateEnv,
};

