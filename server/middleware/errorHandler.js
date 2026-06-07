// Custom Express error handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  let message = err.message;
  
  // Format Mongoose ValidationErrors to be readable (comma-separated details)
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    res.status(400);
  } 
  // Handle invalid Object ID lookups
  else if (err.name === 'CastError') {
    message = `Resource details not found. Invalid ID parameter format: ${err.value}`;
    res.status(400);
  }

  res.status(res.statusCode || statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
