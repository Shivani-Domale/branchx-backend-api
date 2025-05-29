const errorResponse = (res, message = "Something went wrong", statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [],
  });
};

module.exports = errorResponse;
