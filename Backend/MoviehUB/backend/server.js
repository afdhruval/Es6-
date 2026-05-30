// app instant
import app from "./src/app.js";
import express from "express";
import morgan from "morgan";

// mondo connect
import mongoConnect from "./src/config/db.js";
import movieRoute from "./src/routes/movie.route.js";
mongoConnect();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/movie", movieRoute);

app.listen(3000, () => {
  console.log("server is running on 3000");
});
