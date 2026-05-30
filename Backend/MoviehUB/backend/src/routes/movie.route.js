import express from "express";
const movieRoute = express.Router();
import movieContro from "../controller/movieController.js";

// adding movie
movieRoute.post("/add", movieContro.movieAdd);

// getting movie all
movieRoute.get("/get", movieContro.movieGetAll);

// getting movie perticular
movieRoute.get("/get", movieContro.movieGet);



// updating movie
movieRoute.put("/update/:id",movieContro.updateMovie)

export default movieRoute;
