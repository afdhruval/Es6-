// app instant
import app from "./src/app.js";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mondo connect
import mongoConnect from "./src/config/db.js";
import movieRoute from "./src/routes/movie.route.js";
mongoConnect();

app.use(express.json());
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images from public/ at the root URL
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/movie", movieRoute);

app.listen(3000, () => {
  console.log("server is running on 3000");
});
