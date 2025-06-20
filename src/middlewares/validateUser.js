const { StatusCodes } = require("http-status-codes");
const { ErrorReponse } = require("../utils");

module.exports = (req, res, next) => {
  const { fullName, phone, email, country, state, city, role, businessName, message } = req.body;
  if (!fullName || !phone || !email || !country || !state || !city || !role || !businessName || !message) {
    ErrorReponse(res, StatusCodes.BAD_REQUEST, "All fields required !");
  }
  next();
};
// This middleware checks if all required fields are present in the request body