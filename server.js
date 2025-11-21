const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// make uploads folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Storage for videos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".webm");
    }
});

const upload = multer({ storage });

// Postgres connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{rejectUnauthorized:false}
    
});

// Upload API
app.post("/upload", upload.single("file"), async (req, res) => {
    const { name, requestId } = req.body;
    const videoPath = "/uploads/" + req.file.filename;

    try {
        await pool.query(
            "INSERT INTO kyc_videos (customer_name, request_id, video_path) VALUES ($1, $2, $3)",
            [name, requestId, videoPath]
        );

        res.send("Upload successful!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

// Render port handling
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running at port " + port);
});

