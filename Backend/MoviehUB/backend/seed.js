import mongoose from "mongoose";
import dotenv from "dotenv";
import movieModel from "./src/models/movieModel.js";

dotenv.config();

const MONGO_URI = "mongodb://afdhruval:honVoR7dUWWhECxO@ac-d0i7qrn-shard-00-00.3o3fask.mongodb.net:27017,ac-d0i7qrn-shard-00-01.3o3fask.mongodb.net:27017,ac-d0i7qrn-shard-00-02.3o3fask.mongodb.net:27017/?ssl=true&replicaSet=atlas-3g56x2-shard-0&authSource=admin&appName=Cluster0";

const movies = [
  {
    title: "Dhurandhar",
    hero: "Action Star",
    cast: "Lead Actor, Lead Actress",
    duration: 150,
    description: "An epic tale of a brave hero who rises against all odds to protect his people.",
    imgUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
    trailerMp4: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    title: "Inception",
    hero: "Cobb",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
    duration: 148,
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    imgUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    trailerMp4: "https://www.youtube.com/embed/YoHD9XEInc0"
  },
  {
    title: "The Dark Knight",
    hero: "Batman",
    cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
    duration: 152,
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    imgUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    trailerMp4: "https://www.youtube.com/embed/EXeTwQWrcwY"
  },
  {
    title: "Interstellar",
    hero: "Cooper",
    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    duration: 169,
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    imgUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDItN2IxOS00ZaJlLWEmY2QtNDFlZTZjNjY0Zjc4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg",
    trailerMp4: "https://www.youtube.com/embed/zSWdZVtXT7E"
  },
  {
    title: "The Matrix",
    hero: "Neo",
    cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    duration: 136,
    description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    imgUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
    trailerMp4: "https://www.youtube.com/embed/vKQi3bBA1y8"
  },
  {
    title: "Spider-Man: No Way Home",
    hero: "Peter Parker",
    cast: "Tom Holland, Zendaya, Benedict Cumberbatch",
    duration: 148,
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    imgUrl: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjZi00YmZlLThmZDItZjBlOGFhYTBhZDQ2XkEyXkFqcGdeQXVyMzU5LTE2NjY@._V1_FMjpg_UX1000_.jpg",
    trailerMp4: "https://www.youtube.com/embed/JfVOs4VSpmA"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB, inserting movies...");
    await movieModel.insertMany(movies);
    console.log("Successfully added 6 movies!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

seedDB();
