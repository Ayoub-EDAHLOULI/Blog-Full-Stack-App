const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/multerMiddleware");

const {
  getAllArticles,
  createArticle,
  getOneArticle,
  updateArticle,
  deleteArticle,
  uploadImage,
} = require("../controller/articleController");

router
  .route("/article")
  .post(isAuthenticated, isAuthorized("ADMIN", "AUTHOR"), createArticle);
router.route("/articles").get(getAllArticles);
router
  .route("/article/:id")
  .get(getOneArticle)
  .put(isAuthenticated, isAuthorized("ADMIN", "AUTHOR"), updateArticle)
  .delete(isAuthenticated, isAuthorized("ADMIN", "AUTHOR"), deleteArticle);

router.route("/upload").post(upload.single("image"), uploadImage);

module.exports = router;
