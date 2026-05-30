import movieModel from "../models/movieModel.js";

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

  return res.status(201).json({
    message: "movie created",
    movie,
  });
}

async function movieGet(req, res) {
  const movies = await movieModel.find();

  return res.status(200).json({
    message: "movie generated ",
    movies,
  });
}

async function updateMovie(req, res) {
  const id = req.params;

  const movie = await movieModel.findByIdAndUpdate(id, req.body, { new: true });

  if (!movie) {
    return res.status(404).json({
      message: "Movie not founded",
    });
  }

  return res.status(200).json({
    message: "movie updated successfully",
    movie,
  });
}

export default {
  movieAdd,
  movieGet,
  updateMovie,
};
