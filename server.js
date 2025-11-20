const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Make uploads folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".webm");
    }
});

const upload = multer({ storage });

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kyc_db"
});

// API to upload video
app.post("/upload", upload.single("file"), (req, res) => {
    const name = req.body.name;
    const requestId = req.body.requestId;
    const videoPath = "/uploads/" + req.file.filename;

    const sql = "INSERT INTO kyc_videos(customer_name, request_id, video_path) VALUES (?, ?, ?)";

    db.query(sql, [name, requestId, videoPath], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }
        res.send("Upload successful!");
    });
});

// Start server
app.listen(3000, () => {
    console.log("Backend running at http://localhost:3000");
});
