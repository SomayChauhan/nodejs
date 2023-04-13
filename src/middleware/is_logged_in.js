const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { createCustomError } = require("../utils/custom_error");

const is_logged_in = async (req, res, next) => {
  // 1) Getting token and check of it's there
  if (!req.cookies.jwt) {
    throw createCustomError(
      "You are not logged in! Please log in to get access.",
      401
    );
  }

  let token = req.cookies.jwt;

  // 2) Verifing token
  const decoded = await promisify(jwt.verify)(
    token,
    "some-super-long-random-string"
  );

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw createCustomError(
      "The user belonging to this token does no longer exist.",
      401
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw createCustomError(
      "User recently changed password! Please log in again.",
      401
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};

module.exports = is_logged_in;
