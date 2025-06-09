const { StatusCodes } = require("http-status-codes");
const logger = require("../config/logger");
const { ErrorReponse } = require("../utils");

module.exports = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`);
  ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
};
