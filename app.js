const express = require("express");
require("express-async-errors");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const User = require("./models/user");
const connectDB = require("./db/connect");
const cors = require("cors");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express(); //create an express app

app.use(express.json()); // does JSON.parse() on ever request data object
app.use(cors()); // this is to fix the cors issue

app.use("/api/v1/shop", shopRouter); //api/v1 is the defalut path for shop route
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware); //runs if no route matches the routes sent in request
app.use(errorHandlerMiddleware);

const start = async () => {
  const callback = () => {
    app.listen(3000, console.log("server listening on port 3000")); //start the server on port 3000
    User.findOne().then(async (user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
  };
  try {
    connectDB(`mongodb+srv://somay_chauhan:somay@cluster0.vtchn.mongodb.net/?retryWrites=true&w=majority`, callback); //connect to the database
  } catch (error) {
    console.log(error, "errorerror");
  }
};

start();
