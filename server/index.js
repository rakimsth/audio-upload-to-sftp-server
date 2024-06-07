const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Handle file upload endpoint
app.post("/upload", upload.single("audio"), (req, res) => {
  const { originalname, path } = req.file;
  console.log(`Received file: ${originalname} at path: ${path}`);
  res.send("File uploaded successfully.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
