const prisma = require("../server");
const { ErrorHandler, handleError } = require("../utils/errorHandler");
const { handleSuccess } = require("../utils/responseHandler");

//Create a comment
const createComment = async (req, res) => {
  try {
    const { content, articleId } = req.body;
    const author = req.user;
    const authorId = req.user.id;

    //Check if the article exists
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    //Check if the author exists
    const authorExist = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!article) throw new ErrorHandler(404, "Article not found");

    if (!authorExist) throw new ErrorHandler(404, "Author not found");

    //Check if content is empty
    if (
      content === "" ||
      content === null ||
      content === undefined ||
      content.search(/[^\n\s]/) == -1
    ) {
      throw new ErrorHandler(400, "Content is required");
    }

    //Get the author name
    const authorName = author.name;

    //Create a new comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        authorId,
        articleId,
        role: author.role,
        authorName,
      },
      include: {
        author: true,
        article: true,
      },
    });

    //Return the new comment
    handleSuccess(res, newComment, 201, "Comment created successfully");
  } catch (error) {
    //Call the handleError function
    handleError(res, error);
  }
};

//Retrieve all comments for a specific article.
const getAllComments = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if the article exists
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!article) throw new ErrorHandler(404, "Article not found");

    //Retrieve all comments for a specific article
    const comments = await prisma.comment.findMany({
      where: {
        articleId: parseInt(id),
      },
      include: {
        article: true,
        author: true,
      },
    });

    //Return all comments
    handleSuccess(res, comments, 200, "Comments retrieved successfully");
  } catch (error) {
    //Call the handleError function
    handleError(res, error);
  }
};

//Get One Comment
const getOneComment = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if the comment exists
    const commentExist = await prisma.comment.findUnique({
      relationLoadStrategy: "join",
      where: {
        id: parseInt(id),
      },
    });

    if (!commentExist) throw new ErrorHandler(404, "Comment not found");

    //Retrieve a comment
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        article: true,
        author: true,
      },
    });

    //Return the comment
    handleSuccess(res, comment, 200, "Comment retrieved successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    //Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!comment) throw new ErrorHandler(404, "Comment not found");

    //Check if content is empty
    if (
      content === "" ||
      content === null ||
      content === undefined ||
      content.search(/[^\n\s]/) == -1
    ) {
      throw new ErrorHandler(400, "Content is required");
    }

    //Check if the content is empty
    if (!content) throw new ErrorHandler(400, "Content is required");

    //Check if the content is the same as the previous one
    if (content === comment.content) throw new ErrorHandler(400, "No changes");

    //Update the comment
    const updateComment = await prisma.comment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        content,
      },
    });

    //Return the updated comment
    handleSuccess(res, updateComment, 200, "Comment updated successfully");
  } catch (error) {
    //Call the handleError function
    handleError(res, error);
  }
};

//Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if the comment exists
    const commentExist = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!commentExist) throw new ErrorHandler(404, "Comment not found");

    //Delete a comment
    const deleteComment = await prisma.comment.delete({
      where: {
        id: parseInt(id),
      },
    });

    //Return success message
    handleSuccess(res, null, 204, "Comment deleted successfully");
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  createComment,
  getAllComments,
  getOneComment,
  updateComment,
  deleteComment,
};
