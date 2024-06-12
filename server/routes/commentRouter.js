const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/authMiddleware");

// Import the createComment function from the commentController
const {
  createComment,
  getAllComments,
  getOneComment,
  updateComment,
  deleteComment,
} = require("../controller/commentController");

router
  .route("/comment")
  .post(
    isAuthenticated,
    isAuthorized("ADMIN", "AUTHOR", "GUEST"),
    createComment
  );
router.route("/comments/:id").get(getAllComments);
router
  .route("/comment/:id")
  .get(isAuthenticated, isAuthorized("ADMIN", "AUTHOR", "GUEST"), getOneComment)
  .put(isAuthenticated, isAuthorized("ADMIN", "AUTHOR"), updateComment)
  .delete(isAuthenticated, isAuthorized("ADMIN", "AUTHOR"), deleteComment);

module.exports = router;
