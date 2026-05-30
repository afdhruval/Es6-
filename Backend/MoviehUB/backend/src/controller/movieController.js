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

async function movieGet(req,res){
    const movies = await movieModel.find()

    return res.status(200).json({
        message : "movie generated ",
        movies
    })
}

export default {
  movieAdd,movieGet
};
