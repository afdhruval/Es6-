import express from "express";
import movieController from "../controller/movieController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", movieController.homePage);

// Pages
router.get("/movies", movieController.movieGetAll);
router.get("/movie/:id", movieController.movieGet);
router.get("/movie/edit/:id", movieController.editMoviePage);
router.get("/add", movieController.addMoviePage);

// Form Submit — multer handles the image field "poster"
router.post("/add", upload.single("poster"), movieController.addMovie);
router.post("/update/:id", upload.single("poster"), movieController.updateMovie);
router.post("/delete/:id", movieController.deleteMovie);

export default router;