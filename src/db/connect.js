const mongoose = require("mongoose");

const connectDB = (url, callback) => {
  return mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
    },
    callback
  );
};

module.exports = connectDB;
