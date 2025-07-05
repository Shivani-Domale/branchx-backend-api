// const { StatusCodes } = require("http-status-codes");
// const { ErrorReponse } = require("../utils");
// const logger = require("../config/logger"); // Optional: for logging

// module.exports = (req, res, next) => {
//   try {
//     const { fullName, phone, email, country, state, city, role, businessName, message } = req.body;

//     if (!fullName || !phone || !email || !country || !state || !city || !role || !businessName || !message) {
//       logger?.warn?.(`Validation failed - Missing fields in request body - ${req.method} ${req.originalUrl}`);
//       return ErrorReponse(res, StatusCodes.BAD_REQUEST, "All fields required!");
//     }

//     next();
//   } catch (error) {
//     logger?.error?.(`Validation error - ${error.message} - ${req.method} ${req.originalUrl}`);
//     return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong during validation.");
//   }
// };
