const { ErrorHandler, handleError } = require("../utils/errorHandler");
const { handleSuccess } = require("../utils/responseHandler");
const prisma = require("../server");
const bcrypt = require("bcrypt");

//Get all users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        articles: true,
        comments: true,
      },
    });

    //Check if users exist
    if (!users) throw new ErrorHandler(404, "No users found");

    //Return users
    handleSuccess(res, users, 200, "Users retrieved successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Get One User
const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        articles: true,
        comments: true,
      },
    });

    if (!user) throw new ErrorHandler(404, "User not found");

    //Return user
    handleSuccess(res, user, 200, "User retrieved successfully");
  } catch (error) {
    handleError(res, error);
  }
};

//Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check if name, email and password are provided
    if (!name || !email || !password)
      throw new ErrorHandler(400, "Please provide name, email and password");

    //Check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email))
      throw new ErrorHandler(400, "Please provide a valid email");

    //Check if password is valid
    if (password.length < 6)
      throw new ErrorHandler(400, "Password should be at least 6 characters");

    //Check if email already exists
    const emailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailExists) throw new ErrorHandler(400, "Email already exists");

    //Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    //Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    //Return user
    handleSuccess(res, user, 201, "User created successfully");
  } catch (error) {
    //Call the handleError function
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

//Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, profilePic, bio } = req.body;

    //Check if user exists
    const userExists = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!userExists) throw new ErrorHandler(404, "User not found");

    //Check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email))
      throw new ErrorHandler(400, "Please provide a valid email");

    //Check if password is valid
    if (password.length < 6)
      throw new ErrorHandler(400, "Password should be at least 6 characters");

    //Check if email already exists
    const emailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    //Check if email already exists and is not the user's email
    if (emailExists && emailExists.email !== userExists.email)
      throw new ErrorHandler(400, "Email already exists");

    //Check if password is the same as the previous password
    if (password === userExists.password)
      throw new ErrorHandler(400, "Password is incorrect");

    //Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    //Update user
    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        email,
        password: hashedPassword,
        profilePic,
        bio,
      },
    });

    //Return updated user
    handleSuccess(res, user, 200, "User updated successfully");
  } catch (error) {
    //Call the handleError function
    handleError(res, error);
  }
};

//Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if user exists
    const userExists = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!userExists) throw new ErrorHandler(404, "User not found");

    //Delete associated articles
    await prisma.article.deleteMany({
      where: {
        authorId: parseInt(id),
      },
    });

    //Delete associated comments
    await prisma.comment.deleteMany({
      where: {
        authorId: parseInt(id),
      },
    });

    //Delete user
    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    //Return success message
    handleSuccess(res, null, 204, "User deleted successfully");
  } catch (error) {
    //Call the handleError function
    handleError(res, error);
  }
};

//Delete all users
const deleteAllUsers = async (req, res) => {
  try {
    //Delete all users
    await prisma.user.deleteMany();

    //Return success message
    handleSuccess(res, null, 204, "All users deleted successfully");
  } catch (error) {
    //Call the handleError function
    handleError(res, error);
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getOneUser,
  deleteAllUsers,
  uploadImage,
};
