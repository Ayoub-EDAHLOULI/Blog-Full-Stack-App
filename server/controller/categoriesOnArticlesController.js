const prisma = require("../server");
const { ErrorHandler, handleError } = require("../utils/errorHandler");
const { handleSuccess } = require("../utils/responseHandler");

//Get all categories on an article
const getCategoriesOnArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    //Check if article exists
    const articleExists = await prisma.article.findUnique({
      where: {
        id: parseInt(articleId),
      },
    });

    if (!articleExists) throw new ErrorHandler(404, "Article not found");

    const categories = await prisma.category.findMany({
      where: {
        articles: {
          some: {
            articleId: parseInt(articleId),
          },
        },
      },
    });

    //If no categories are found
    if (categories.length === 0)
      throw new ErrorHandler(404, "No categories found");

    //Return categories
    handleSuccess(res, categories);
  } catch (error) {
    handleError(res, error);
  }
};

//Create a new category on an article
const createCategoryOnArticle = async (req, res) => {
  try {
    const { articleId, categoryId } = req.params;

    //Check if article exists
    const articleExists = await prisma.article.findUnique({
      where: {
        id: parseInt(articleId),
      },
    });

    if (!articleExists) throw new ErrorHandler(404, "Article not found");

    //Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: parseInt(categoryId),
      },
    });

    if (!categoryExists) throw new ErrorHandler(404, "Category not found");

    //Check if category is already on article
    const categoryOnArticle = await prisma.categoriesOnArticles.findFirst({
      where: {
        articleId: parseInt(articleId),
        categoryId: parseInt(categoryId),
      },
    });

    if (categoryOnArticle)
      throw new ErrorHandler(400, "Category already on article");

    //Create category on article
    const category = await prisma.categoriesOnArticles.create({
      data: {
        articleId: parseInt(articleId),
        categoryId: parseInt(categoryId),
      },
    });

    //Return category
    handleSuccess(res, category, 201, "Category added to article successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Delete a category on an article
const deleteCategoryOnArticle = async (req, res) => {
  try {
    const { articleId, categoryId } = req.params;

    //Check if article exists
    const articleExists = await prisma.article.findUnique({
      where: {
        id: parseInt(articleId),
      },
    });

    if (!articleExists) throw new ErrorHandler(404, "Article not found");

    //Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: parseInt(categoryId),
      },
    });

    if (!categoryExists) throw new ErrorHandler(404, "Category not found");

    //Check if category is on article
    const categoryOnArticle = await prisma.categoriesOnArticles.findFirst({
      where: {
        articleId: parseInt(articleId),
        categoryId: parseInt(categoryId),
      },
    });

    if (!categoryOnArticle)
      throw new ErrorHandler(404, "Category not in article");

    await prisma.categoriesOnArticles.delete({
      where: {
        articleId_categoryId: {
          articleId: parseInt(articleId),
          categoryId: parseInt(categoryId),
        },
      },
    });

    //Return success message
    handleSuccess(res, null, 200, "Category removed from article successfully");
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getCategoriesOnArticle,
  createCategoryOnArticle,
  deleteCategoryOnArticle,
};
