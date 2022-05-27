const express = require("express");
const path = require("path");

const router = express.Router();
const root_dir = require("../utils/path");

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(root_dir, "views", "add-product.html"));
});

router.post("/products", (req, res, next) => {
  console.log(req.body.title);
  res.redirect("/");
});

router.get("/products", (req, res, next) => {
  res.send(`<body><h1>products page</h1></body>`);
});

module.exports = router;
