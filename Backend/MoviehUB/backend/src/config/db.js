// database creation
import mongoose from "mongoose";
import config from "./config.js";

const mongoConnect = () => {
  mongoose.connect(config.MONGO_URI).then(() => {
    console.log("connected to the database");
  });
};

export default mongoConnect;
