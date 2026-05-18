import express from "express";
import path from "path";
import mongoConnect from "./src/config/db.js";
import bookRoute from "./src/routes/bookRoutes.js";

const app = express();

mongoConnect();

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.urlencoded({ extended: true }));

app.use("/upload", express.static(path.join(process.cwd(), "upload")));

app.use(bookRoute);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
