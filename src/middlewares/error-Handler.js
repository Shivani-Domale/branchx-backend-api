const { StatusCodes } = require("http-status-codes");
const logger = require("../config/logger");
const { ErrorReponse } = require("../utils");

module.exports = (err, req, res, next) => {
  try {
    logger?.error?.(`${err?.message} - ${req?.method} ${req?.originalUrl} - ${req?.ip}`);
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  } catch (error) {
    console.error('Global Error Handler Failure:', error?.message);
    res.status(500).json({ message: 'Critical Server Error' });
  }
};
