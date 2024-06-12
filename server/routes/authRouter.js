const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/authMiddleware");

const { register, login } = require("../controller/Auth/authController");

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
