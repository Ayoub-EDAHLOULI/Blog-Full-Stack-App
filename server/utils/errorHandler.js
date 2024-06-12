//Error handler class
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

//Error handler function
const handleError = (res, error) => {
  const { statusCode = 500, message = "An error occured" } = error;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

//Export the error handler class and function
module.exports = { ErrorHandler, handleError };
