import movieModel from "../models/movieModel.js";

async function movieGetAll(req, res) {
  const movies = await movieModel.find();

  res.render("movies", {
    movies,
  });
}

async function homePage(req, res) {
  const movies = await movieModel.find();

  res.render("home", {
    movies,
  });
}

async function movieGet(req, res) {
  const movie = await movieModel.findById(req.params.id);

  res.render("movie", {
    movie,
  });
}

async function editMoviePage(req, res) {
  const movie = await movieModel.findById(req.params.id);

  res.render("editMovie", {
    movie,
  });
}

async function updateMovie(req, res) {
  await movieModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.redirect("/api/movie/movies");
}

async function addMoviePage(req, res) {
  res.render("addMovie");
}

async function addMovie(req, res) {
  const { title, hero, cast, duration, description, imgUrl, trailerMp4 } = req.body;
  await movieModel.create({
    title,
    hero,
    cast,
    duration,
    description,
    imgUrl,
    trailerMp4
  });
  res.redirect("/api/movie/movies");
}

async function deleteMovie(req, res) {
  await movieModel.findByIdAndDelete(req.params.id);
  res.redirect("/api/movie/movies");
}

export default {
  movieGetAll,
  movieGet,
  editMoviePage,
  updateMovie,
  homePage,
  addMoviePage,
  addMovie,
  deleteMovie
};