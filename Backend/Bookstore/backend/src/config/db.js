import mongoose from "mongoose";

async function mongoConnect() {
  try {
    await mongoose.connect(
       "mongodb://Dhruval:MOHsmQG4RIET3Al5@ac-cdourzz-shard-00-00.gpsr3jg.mongodb.net:27017,ac-cdourzz-shard-00-01.gpsr3jg.mongodb.net:27017,ac-cdourzz-shard-00-02.gpsr3jg.mongodb.net:27017/Books?ssl=true&replicaSet=atlas-lfdrbn-shard-0&authSource=admin&retryWrites=true&w=majority"
    );

    console.log("Connected to database");
  } catch (error) {
    console.log("MongoDB Error:", error);
  }
}

export default mongoConnect;
