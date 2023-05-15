const return400 = (res) => {
  res.statusCode = 400;
  res.end("Unsupported method");
};

const return404 = (res) => {
  res.statusCode = 404;
  res.end("Not found");
};

const return500 = (res) => {
  res.statusCode = 500;
  res.end("Server error");
};

module.exports = {
  return400,
  return404,
  return500
}