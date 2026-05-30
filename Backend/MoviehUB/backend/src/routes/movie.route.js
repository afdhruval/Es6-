import express from "express";
import movieController from "../controller/movieController.js";

const router = express.Router();

// EJS Pages
router.get("/", movieController.homePage);

router.get("/movies", movieController.moviesPage);

router.get("/movie/:id", movieController.moviePage);

router.get("/movie/edit/:id", movieController.editMoviePage);

// APIs
router.post("/add", movieController.movieAdd);

router.get("/all", movieController.getAllMoviesApi);

router.get("/:id", movieController.getMovieApi);

router.put("/update/:id", movieController.updateMovie);

router.delete("/delete/:id", movieController.deleteMovie);

export default router;