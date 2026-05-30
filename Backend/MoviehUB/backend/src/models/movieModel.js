import mongoose from "mongoose";

const movieSchama = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hero: {
    type: String,
    required: true,
  },
  cast: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  trailerMp4: {
    type: String,
  },
});

const movieModel = mongoose.model("movies", movieSchama);

export default movieModel
