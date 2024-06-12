const express = require("express");
const router = express.Router();
const {
  isAuthorized,
  isAuthenticated,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/multerMiddleware");

const {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getOneUser,
  deleteAllUsers,
  uploadImage,
} = require("../controller/userController");

router.route("/user").post(isAuthenticated, isAuthorized("ADMIN"), createUser);
router
  .route("/users")
  .get(isAuthenticated, isAuthorized("ADMIN"), getUsers)
  .delete(isAuthenticated, isAuthorized("ADMIN"), deleteAllUsers);
router
  .route("/user/:id")
  .get(getOneUser)
  .put(isAuthenticated, updateUser)
  .delete(isAuthenticated, isAuthorized("ADMIN"), deleteUser);

router.route("/upload").post(upload.single("image"), uploadImage);

module.exports = router;
