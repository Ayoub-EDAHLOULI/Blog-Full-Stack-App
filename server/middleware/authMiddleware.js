const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  //Authorization: Bearer <token>
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader || !bearerHeader.startsWith("Bearer")) {
    return res.status(401).json({
      error: "Access denied",
    });
  }
  const token = bearerHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access denied",
    });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat, //Issued time
      exp: decoded.exp, //Expiration time
    };

    next();
  } catch (error) {
    res.status(400).json({
      error: "Unauthorized access",
      message: error.message,
    });
  }
};

//Authorization

//Middleware to check if user is authorized
const isAuthorized = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "You are not authenticated",
      });
    }

    //Check if the user role is in the roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: `You are not authorized to perform this action. Required roles: ${roles.join(
          ","
        )}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = { isAuthenticated, isAuthorized };
