const { createCustomError } = require("../utils/custom_error");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, "some-super-long-random-string", {
    expiresIn: "30d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    // token,
    data: {
      user,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createCustomError("Please provide email and password!", 400);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw createCustomError("Incorrect email or password", 401);
  } else {
    createSendToken(user, 201, res);
  }
};

const signup = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.findOne({ email: email });
  if (!!user) {
    throw createCustomError("user alredy exists", 400);
  } else {
    const new_user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      cart: { items: [] },
    });
    createSendToken(new_user, 201, res);
  }
};

module.exports = {
  login,
  signup,
};
