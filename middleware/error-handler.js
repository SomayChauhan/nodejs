const { CustomAPIError } = require("../utils/custom-error");
const errorHandlerMiddleware = async (err, req, res, next) => {
  console.log(err, "errr");
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).json({ msg: "Something went wrong, please try again" });
};

module.exports = errorHandlerMiddleware;
