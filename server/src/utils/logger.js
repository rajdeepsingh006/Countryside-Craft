const morgan = require('morgan');
const { NODE_ENV } = require('../config/env');

// Use 'dev' format in development, 'combined' in production
const logger = morgan(NODE_ENV === 'production' ? 'combined' : 'dev');

module.exports = logger;
