import bookModel from "../models/book.model.js";

// Home Page
export const homePage = async (req, res) => {
  const books = await bookModel.find();

  res.render("index", { books });
};

// Add Book
export const addBook = async (req, res) => {
  const { bookName, bookAuthor, bookPrice } = req.body;

  await bookModel.create({
    bookName,
    bookAuthor,
    bookPrice,
    image: req.file ? req.file.filename : "",
  });

  res.redirect("/");
};

// Edit Page
export const editPage = async (req, res) => {
  const book = await bookModel.findById(req.params.id);

  res.render("edit", { book });
};

// Update Book
export const updateBook = async (req, res) => {
  const { bookName, bookAuthor, bookPrice } = req.body;

  const updatedBook = {
    bookName,
    bookAuthor,
    bookPrice,
  };

  if (req.file) {
    updatedBook.image = req.file.filename;
  }

  await bookModel.findByIdAndUpdate(req.params.id, updatedBook);

  res.redirect("/");
};

// Delete Book
export const deleteBook = async (req, res) => {
  await bookModel.findByIdAndDelete(req.params.id);

  res.redirect("/");
};
