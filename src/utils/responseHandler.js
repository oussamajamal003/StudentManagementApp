class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const sendResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        status: "error",
        error: message
    });
};

module.exports = {
  AppError,
  sendResponse,
  sendError
};
