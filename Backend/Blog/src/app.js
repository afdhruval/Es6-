import express from "express";
import mongoConnect from "./config/db.js";
import authRoute from "./router/blog.route.js";

mongoConnect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/blog", authRoute);

export default app;
