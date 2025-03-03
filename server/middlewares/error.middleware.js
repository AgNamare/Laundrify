const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Ensure we don’t send a 200 status with an error
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

export default errorHandler;
