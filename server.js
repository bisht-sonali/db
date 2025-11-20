const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());


//mul storage config

const storage = multer.disk.storage({
    destination:(reg,file,cb) => {
        cb(null,"uploads/");
    },
    filename:(reg,file,cb) =>{
        cb(null,Date.now()+".webm");
    }
});

const upload = mutler({storage});


//MySql connection

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"kyc_db"
});


//API to upload vid

app.post("/upload",upload.single("file"),(req,res) =>{
    const name = req.body.name;
    const requestId = req.body.requestId;
    const videoPath = req.body.path;

    const sql = "INSERT INTO kyc_videos(customer_name, request_id, video_path)VALUES(?,?,?)";
    db.query(sql[name,requestId,videoPath],(err) => {
        if (err){
            console.log(err);
            return res.status(500).send("Database error");
        }
        res.rend("upload succesful!");
    });
}); 

app.listen(3000,() =>{
    console.log("Backend running at http.//localhost:300")
});



