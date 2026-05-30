import movieModel from "../models/movieModel.js";


// CREATE MOVIE


async function movieAdd(req, res) {
  const { title, hero, cast, duration, description, imgUrl, trailerMp4 } =
    req.body;

  const movie = await movieModel.create({
    title,
    hero,
    cast,
    duration,
    description,
    imgUrl,
    trailerMp4,
  });

  res.status(201).json({
    message: "Movie Created",
    movie,
  });
}


// GET ALL MOVIES API


async function getAllMoviesApi(req, res) {
  const movies = await movieModel.find();

  res.status(200).json({
    message: "Movies fetched",
    movies,
  });
}


// GET SINGLE MOVIE API


async function getMovieApi(req, res) {
  const { id } = req.params;

  const movie = await movieModel.findById(id);

  res.status(200).json({
    movie,
  });
}


// UPDATE API


async function updateMovie(req, res) {
  const { id } = req.params;

  const movie = await movieModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Movie Updated",
    movie,
  });
}


// 


async function deleteMovie(req, res) {
  const { id } = req.params;

  await movieModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "Movie Deleted",
  });
}


// EJS HOME PAGE


async function homePage(req, res) {
  res.render("home");
}


// EJS ALL MOVIES PAGE


async function moviesPage(req, res) {
  const movies = await movieModel.find();

  res.render("movies", {
    movies,
  });
}


// EJS SINGLE MOVIE PAGE


async function moviePage(req, res) {
  const { id } = req.params;

  const movie = await movieModel.findById(id);

  res.render("movie", {
    movie,
  });
}


// EJS EDIT PAGE


async function editMoviePage(req, res) {
  const { id } = req.params;

  const movie = await movieModel.findById(id);

  res.render("editMovie", {
    movie,
  });
}

export default {
  movieAdd,
  getAllMoviesApi,
  getMovieApi,
  updateMovie,
  deleteMovie,
  homePage,
  moviesPage,
  moviePage,
  editMoviePage,
};