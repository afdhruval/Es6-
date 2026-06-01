import movieModel from "../models/movieModel.js";

async function movieGetAll(req, res) {
  const movies = await movieModel.find();
  res.render("movies", { movies });
}

async function homePage(req, res) {
  const movies = await movieModel.find();
  res.render("home", { movies });
}

async function movieGet(req, res) {
  const movie = await movieModel.findById(req.params.id);
  res.render("movie", { movie });
}

async function editMoviePage(req, res) {
  const movie = await movieModel.findById(req.params.id);
  res.render("editMovie", { movie });
}

// Helper: build imgUrl from uploaded file OR typed URL
function resolveImgUrl(req) {
  if (req.file) {
    // multer saved the file — serve it from /uploads/posters/...
    return `/uploads/posters/${req.file.filename}`;
  }
  // fall back to whatever was typed in imgUrl field
  return req.body.imgUrl || "";
}

async function updateMovie(req, res) {
  const imgUrl = resolveImgUrl(req);

  await movieModel.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      hero: req.body.hero,
      cast: req.body.cast,
      duration: req.body.duration,
      description: req.body.description,
      trailerMp4: req.body.trailerMp4,
      imgUrl,
    },
    { new: true }
  );

  res.redirect("/api/movie/movies");
}

async function addMoviePage(req, res) {
  res.render("addMovie");
}

async function addMovie(req, res) {
  const { title, hero, cast, duration, description, trailerMp4 } = req.body;
  const imgUrl = resolveImgUrl(req);

  await movieModel.create({
    title,
    hero,
    cast,
    duration,
    description,
    imgUrl,
    trailerMp4,
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
  deleteMovie,
};