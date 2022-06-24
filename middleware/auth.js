const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { createCustomError } = require("../errors/custom-error");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeaderauthHeader");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createCustomError("Not authorized to access this route", 400));
  }
  const token = authHeader.split(" ")[1];
  let decodedToken = jwt.verify(token, "somesupersecretsecret");
  if (!decodedToken) {
    return next(createCustomError("Not authorized to access this route", 400));
  }
  const user = await User.findById(decodedToken.userId);
  console.log(user, "userrrrrrrr");
  req.user = user;
  next();
};

module.exports = authMiddleware;
