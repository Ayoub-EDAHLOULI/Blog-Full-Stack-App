const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/authMiddleware");

const {
  getCategoriesOnArticle,
  createCategoryOnArticle,
  deleteCategoryOnArticle,
} = require("../controller/categoriesOnArticlesController");

router.route("/article/:articleId/category").get(getCategoriesOnArticle);
router
  .route("/article/:articleId/category/:categoryId")
  .post(isAuthenticated, isAuthorized("ADMIN"), createCategoryOnArticle)
  .delete(deleteCategoryOnArticle);

module.exports = router;
