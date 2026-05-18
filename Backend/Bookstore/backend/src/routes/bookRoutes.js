import express from "express";
import multer from "multer";
import path from "path";

import { homePage,addBook,editPage,updateBook,deleteBook} from "../controller/bookController.js";

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: "upload",

  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);

    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", homePage);

router.post("/add", upload.single("image"), addBook);

router.get("/edit/:id", editPage);

router.post("/update/:id", upload.single("image"), updateBook);

router.post("/delete/:id", deleteBook);

export default router;
