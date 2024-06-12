const prisma = require("../server");
const { ErrorHandler, handleError } = require("../utils/errorHandler");
const { handleSuccess } = require("../utils/responseHandler");

//Create a category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    //Return new category
    handleSuccess(res, newCategory, 201, "Category created successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Create Multiple Categories
const createMultipleCategories = async (req, res) => {
  try {
    const categories = req.body;
    const newCategories = await prisma.category.createMany({
      data: categories,
    });

    //Return new categories
    handleSuccess(res, newCategories, 201, "Categories created successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Retrieve all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    //Return all categories
    handleSuccess(res, categories, 200, "Categories retrieved successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Get one category
const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!categoryExists) throw new ErrorHandler(404, "Category not found");

    //Get category
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        articles: true,
      },
    });

    //Return category
    handleSuccess(res, category, 200, "Category retrieved successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    //Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!categoryExists) throw new ErrorHandler(404, "Category not found");

    //Update category
    const updateCategory = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    //Return updated category
    handleSuccess(res, updateCategory, 200, "Category updated successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!categoryExists) throw new ErrorHandler(404, "Category not found");

    //Find articles associated with category
    const articlesOfCategory = await prisma.categoriesOnArticles.findMany({
      where: {
        categoryId: parseInt(id),
      },
    });

    //Delete each article associated with category
    articlesOfCategory.forEach(async (article) => {
      await prisma.article.delete({
        where: {
          id: article.articleId,
        },
      });
    });

    //Delete each comment associated with article
    articlesOfCategory.forEach(async (article) => {
      await prisma.comment.deleteMany({
        where: {
          articleId: article.articleId,
        },
      });
    });

    //Delete category
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    //Return success message
    handleSuccess(res, null, 200, "Category deleted successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Delete All Categories
const deleteAllCategories = async (req, res) => {
  try {
    await prisma.category.deleteMany();

    //Return success message
    handleSuccess(res, null, 200, "All categories deleted successfully");
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  createCategory,
  createMultipleCategories,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
};
