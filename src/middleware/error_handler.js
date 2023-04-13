const { CustomAPIError, createCustomError } = require("../utils/custom_error");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return createCustomError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return createCustomError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. * ${errors.join(" * ")}`;
  return createCustomError(message, 400);
};

const handleJWTError = () =>
  createCustomError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  createCustomError("Your token has expired! Please log in again.", 401);

const error_handler = async (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ error: err.message });
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCastErrorDB(error);

    if (err.code === 11000) error = handleDuplicateFieldsDB(error);

    if (err.name === "ValidationError") error = handleValidationErrorDB(error);

    if (err.name === "JsonWebTokenError") error = handleJWTError();

    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    return res.status(error.statusCode).json({ error: error.message });
  }
  // return res
  //   .status(500)
  //   .json({ error: "Something went wrong, please try again" });
};

module.exports = error_handler;
