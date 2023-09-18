const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished;

  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name || readPage > pageCount) {
    let message;
    if (!name) {
      message = " Mohon isi nama buku";
    } else if (readPage > pageCount) {
      message = " readPage tidak boleh lebih besar dari pageCount";
    }
    const response = h.response({
      status: "fail",
      message: `Gagal menambahkan buku.${message}`,
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal menambahkan buku.",
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  const data = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (name) {
    const result = data.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );

    return {
      status: "success",
      data: {
        books: result,
      },
    };
  }

  if (reading || finished) {
    let filteredData;
    if (reading) {
      filteredData = books.filter(
        (book) => book.reading === toBoolean(reading)
      );
    }

    if (finished) {
      filteredData = books.filter(
        (book) => book.finished === toBoolean(finished)
      );
    }

    const result = filteredData.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    function toBoolean(num) {
      if (num === "1") {
        return true;
      } else if (num === "0") {
        return false;
      } else {
        return {
          status: "success",
          data: {
            books: data,
          },
        };
      }
    }

    return {
      status: "success",
      data: {
        books: result,
      },
    };
  }

  const response = h.response({
    status: "success",
    data: {
      books: data,
    },
  });
  response.code(200);
  return response;
};

const getDetailBookHandler = (request, h) => {
  const { bookId } = request.params;
  const data = books.filter((book) => book.id === bookId)[0];

  if (data) {
    return {
      status: "success",
      data: {
        book: data,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name || readPage > pageCount) {
    let message;

    if (!name) {
      message = " Mohon isi nama buku";
    } else if (readPage > pageCount) {
      message = " readPage tidak boleh lebih besar dari pageCount";
    }

    const response = h.response({
      status: "fail",
      message: `Gagal memperbarui buku.${message}`,
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    const updatedAt = new Date().toISOString();

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return {
      status: "success",
      message: "Buku berhasil diperbarui",
    };
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    return {
      status: "success",
      message: "Buku berhasil dihapus",
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getDetailBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
