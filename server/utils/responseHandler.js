//Response handler for success responses
const handleSuccess = (res, data, statusCode = 200, message = "Success") => {
  res.status(statusCode).json({
    status: statusCode || 200,
    message,
    data,
  });
};

//Export the success handler function
module.exports = { handleSuccess };
