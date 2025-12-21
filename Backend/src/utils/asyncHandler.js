const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((err) => next(err)); // pass error to Express error middleware
  };
};

export { asyncHandler };