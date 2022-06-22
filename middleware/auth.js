const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeaderauthHeader");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken = jwt.verify(token, "somesupersecretsecret");
  if (!decodedToken) {
    const error = new Error("Not authorized to access this route");
    error.statusCode = 401;
    throw error;
  }
  const user = await User.findById(decodedToken.userId);
  console.log(user, "userrrrrrrr");
  req.user = user;
  next();
};

module.exports = authMiddleware;
