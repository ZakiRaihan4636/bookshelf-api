const {
  nanoid,
} = require('nanoid');
const books = require('./books');

// menambahkan buku/
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

  // Melakukan pengecekan jika nama kosong atau tidak diisi
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  // Melakukan pengecekan jika nilai readPage lebih besar dari nilai pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };
  // push data dalam book
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length === 1;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished,
  } = request.query;

  let result = books;

  // filter berdasarkan nama
  if (name) {
    result = result.filter((book) => {
      const lowerCaseBookName = book.name.toLowerCase();
      const lowerCaseSearchName = name.toLowerCase();
      return lowerCaseBookName.includes(lowerCaseSearchName);
    });
  }
  // filter berdasarkan reading true atau false
  if (reading) {
    result = result.filter((book) => Number(book.reading) === Number(reading));
  }
  // filter berdasarkan fhinished true atau false
  if (finished) {
    result = result.filter((book) => Number(book.finished) === Number(finished));
  }

  return h.response({
    status: 'success',
    data: {
      books: result.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,

      })),
    },
  });
};

const getBookByIdHandler = (request, h) => {
  const {
    id,
  } = request.params;
  const foundBook = books.find((bookItem) => bookItem.id === id);

  if (foundBook) {
    return h.response({
      status: 'success',
      data: {
        book: foundBook, // Menggunakan properti 'book' di sini
      },
    });
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const {
    id,
  } = request.params;
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

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
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
      finished: pageCount === readPage,
      updatedAt: new Date().toISOString(),
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const {
    id,
  } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
