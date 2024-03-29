const express = require("express");

const router = express.Router();

const { login, signup } = require("../controllers/auth_controller");

router.route("/login").post(login);
router.route("/signup").post(signup);

module.exports = router;
