const { ErrorHandler, handleError } = require("../../utils/errorHandler");
const { handleSuccess } = require("../../utils/responseHandler");
const prisma = require("../../server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    //email to lowercase
    email = email.toLowerCase();

    // Check if name, email and password are provided
    if (!name || !email || !password)
      throw new ErrorHandler(400, "Please provide name, email and password");

    // Check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email))
      throw new ErrorHandler(400, "Please provide a valid email");

    // Check if password is valid
    if (password.length < 6)
      throw new ErrorHandler(400, "Password must be at least 6 characters");

    // Check if email already exists
    const emailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailExists) throw new ErrorHandler(400, "Email already exists");

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return user
    handleSuccess(res, user, 201, "User created successfully");
  } catch (error) {
    // Call the handleError function
    handleError(res, error);
  }
};

// Login a user
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    //email to lowercase
    email = email.toLowerCase();

    // Check if email and password are provided
    if (!email || !password)
      throw new ErrorHandler(400, "Please provide email and password");

    // Check if email exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ErrorHandler(400, "Invalid credentials");

    // Check if password is correct
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) throw new ErrorHandler(400, "Invalid credentials");

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    // Return user
    handleSuccess(res, { token }, 200, "Login successful");
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { register, login };
