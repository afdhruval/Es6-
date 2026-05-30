import express from "express";
const movieRoute = express.Router();
import movieContro from "../controller/movieController.js";

movieRoute.post("/add", movieContro.movieAdd);

movieRoute.get("/get", movieContro.movieGet);

movieRoute.put("/update/:id",movieContro.updateMovie)

export default movieRoute;
