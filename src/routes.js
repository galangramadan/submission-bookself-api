const {
  addBookHandler,
  getAllBookHandler,
  getDetailBook,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBookHandler,
  },
  {
    method: "GET",
    path: "/books/{id}",
    handler: getDetailBook,
  },
];

module.exports = routes;
