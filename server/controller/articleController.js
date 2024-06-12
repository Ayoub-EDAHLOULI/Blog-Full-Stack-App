const prisma = require("../server");
const { ErrorHandler, handleError } = require("../utils/errorHandler");
const { handleSuccess } = require("../utils/responseHandler");

//Get all articles
const getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    //Calculate the start and the end index of the articles
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    //Get all articles
    const articles = await prisma.article.findMany({
      include: {
        author: true,
        comments: true,
        categories: true,
      },
    });

    //Paginate the articles
    const paginatedArticles = articles.slice(startIndex, endIndex);

    //Calculate the total number of pages
    const totalPages = Math.ceil(articles.length / limit);

    //Return the paginated articles
    handleSuccess(
      res,
      {
        articles: paginatedArticles,
        totalPages,
      },
      200,
      "Articles retrieved successfully"
    );
  } catch (error) {
    handleError(res, error);
  }
};

//Get One article
const getOneArticle = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if article exists
    const articleExists = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!articleExists) throw new ErrorHandler(404, "Article not found");
    //Get article
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        author: true,
        comments: true,
        categories: true,
      },
    });

    //Return article
    handleSuccess(res, article, 200, "Article retrieved successfully");
  } catch (error) {
    handleError(res, error);
  }
};

const uploadImage = (req, res) => {
  if (!req.file) {
    throw new ErrorHandler(400, "Please upload an image");
  }
  const imageUrl = `http://127.0.0.1:3000/images/${req.file.filename}`;
  handleSuccess(res, imageUrl, 200, "Image uploaded successfully");
};

//Create an article
const createArticle = async (req, res) => {
  try {
    //Create article
    const { title, content, image, category } = req.body;

    console.log("category ", typeof category);

    if (!title || !content) {
      // Process the received data
      throw new ErrorHandler(
        400,
        "===============> Title and content are required"
      );
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        image,
        categories: {
          create: {
            categoryId: parseInt(category),
          },
        },
        role: req.user.role,
        authorId: req.user.id,
      },
    });

    handleSuccess(res, newArticle, 201, "Article created successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Update an article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    //Check if article exists
    const articleExists = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!articleExists) throw new ErrorHandler(404, "Article not found");

    //Update article
    const updateArticle = await prisma.article.update({
      where: {
        id: parseInt(id),
      },

      data: {
        title,
        content,
        image,
      },
    });

    //Return updated article
    handleSuccess(res, updateArticle, 200, "Article updated successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Delete an article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if article exists
    const articleExists = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!articleExists) throw new ErrorHandler(404, "Article not found");

    //Delete associated comments
    await prisma.comment.deleteMany({
      where: {
        articleId: parseInt(id),
      },
    });

    //Delete article
    await prisma.article.delete({
      where: {
        id: parseInt(id),
      },
    });

    handleSuccess(res, null, 204, "Article deleted successfully");
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  getOneArticle,
  updateArticle,
  deleteArticle,
  uploadImage,
};
