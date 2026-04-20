const { body, query, validationResult } = require('express-validator');

// Validation rules for event ingestion
const validateEvent = [
  body('app_id').notEmpty().withMessage('app_id is required'),
  body('user_id').notEmpty().withMessage('user_id is required'),
  body('action')
    .notEmpty()
    .withMessage('action is required')
    .matches(/^[a-z]+\.[a-z]+$/)
    .withMessage('action must be in format: resource.verb'),
  body('user_email').optional().isEmail().withMessage('Invalid email format'),
  body('resource_type').optional().isString(),
  body('resource_id').optional().isString(),
  body('metadata').optional().isObject(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }
    next();
  },
];

// Validation rules for login
const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }
    next();
  },
];

// Validation rules for app creation
const validateApp = [
  body('id')
    .notEmpty()
    .withMessage('App ID is required')
    .matches(/^[a-z0-9_]+$/)
    .withMessage('App ID must contain only lowercase letters, numbers, and underscores'),
  body('name').notEmpty().withMessage('App name is required'),
  body('description').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }
    next();
  },
];

// Validation rules for event query
const validateEventQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('from').optional().isISO8601().withMessage('Invalid date format'),
  query('to').optional().isISO8601().withMessage('Invalid date format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateEvent,
  validateLogin,
  validateApp,
  validateEventQuery,
};
