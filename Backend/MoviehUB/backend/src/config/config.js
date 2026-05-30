
// add utri from env
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env file");
}

export default {
  MONGO_URI: process.env.MONGO_URI,
};
