import express from "express";
import movieController from "../controller/movieController.js";

const router = express.Router();

router.get("/", movieController.homePage);
// Pages
router.get("/movies", movieController.movieGetAll);
router.get("/movie/:id", movieController.movieGet);
router.get("/movie/edit/:id", movieController.editMoviePage);
router.get("/add", movieController.addMoviePage);

// Form Submit
router.post("/add", movieController.addMovie);
router.post("/update/:id", movieController.updateMovie);
router.post("/delete/:id", movieController.deleteMovie);

export default router;