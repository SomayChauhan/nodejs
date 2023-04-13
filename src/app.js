const express = require("express");
const cookieParser = require("cookie-parser");
require("express-async-errors");
const shop_router = require("./routes/shop_routes");
const auth_router = require("./routes/auth_routes");
const tour_router = require("./routes/tour_routes");
const connectDB = require("./db/connect");
const cors = require("cors");

const notFoundMiddleware = require("./middleware/not-found");
const error_handler = require("./middleware/error_handler");

const app = express(); //create an express app

app.use(express.json()); // does JSON.parse() on every request data object
app.use(cors()); // this is to fix the cors issue
app.use(cookieParser());

app.use("/api/v1/shop", shop_router);
app.use("/api/v1/auth", auth_router);
app.use("/api/v1/tours", tour_router);

app.use(notFoundMiddleware); //runs if no route matches the routes sent in request
app.use(error_handler);

const start = async () => {
  const callback = () => {
    app.listen(3000, console.log("server listening on port 3000")); //start the server on port 3000
  };
  try {
    connectDB(`mongodb+srv://somay_chauhan:somay@cluster0.vtchn.mongodb.net/?retryWrites=true&w=majority`, callback); //connect to the database
  } catch (error) {
    console.log(error, "errorerror");
  }
};

start();
