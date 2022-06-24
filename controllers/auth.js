const { createCustomError } = require("../utils/custom-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(createCustomError("A user with this email could not be found.", 401));
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (isEqual) {
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } else {
    return next(createCustomError("Wrong password!", 401));
  }
};

const logout = async (req, res, next) => {};

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!!user) {
    return next(createCustomError("user alredy exists", 400));
  } else {
    const password_hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      password: password_hash,
      cart: { items: [] },
    });
    res.status(200).json("sucessfully signed up");
  }
};

module.exports = {
  login,
  logout,
  signup,
};
