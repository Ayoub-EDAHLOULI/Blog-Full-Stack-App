const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/authMiddleware");

const {
  createCategory,
  createMultipleCategories,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
} = require("../controller/categoryController");

router.route("/category").post(createCategory);
router
  .route("/categories")
  .post(isAuthenticated, isAuthorized("ADMIN"), createMultipleCategories)
  .get(getAllCategories)
  .delete(isAuthenticated, isAuthorized("ADMIN"), deleteAllCategories);

router
  .route("/category/:id")
  .get(
    isAuthenticated,
    isAuthorized("ADMIN", "AUTHOR", "GUEST"),
    getOneCategory
  )
  .put(isAuthenticated, isAuthorized("ADMIN"), updateCategory)
  .delete(isAuthenticated, isAuthorized("ADMIN"), deleteCategory);

module.exports = router;
