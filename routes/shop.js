const express = require("express");
const path = require("path");

const router = express.Router();

const root_dir = require("../utils/path");

router.get("/", (req, res, next) => {
  res.sendFile(path.join(root_dir, "views", "shop.html"));
});

module.exports = router;
