const { createCustomError } = require("../errors/custom-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
};

const logout = async (req, res, next) => {};

const signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const user = await User.findOne({ email: email });
  if (!!user) {
    createCustomError("user alredy exists");
  } else {
    const password_hash = bcrypt.hash(password, 12);
    User.create({
      email,
      password: password_hash,
      cart: { items: [] },
    });
  }
};

module.exports = {
  login,
  logout,
  signup,
};
