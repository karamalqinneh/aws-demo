"use strict";

const dotenv = require('dotenv');
dotenv.config();

// Server Setup
const PORT = process.env.PORT;
const express = require("express");
const cors = require("cors");
const multer = require('multer');
const app = express();
const upload = multer();
const bodyParser = require("body-parser")
const http = require("http");
const server = http.Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

// aws services
const {uploadFile} = require("./aws-s3.service")
const {initSubs, handleSubscriptions} = require("./aws-sns-subscriber.service")

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
    console.log(`connected: ${socket.id}`);
});

app.post('/subscribe',  (req, res) => {
    initSubs();
    res.status(200).send("Subscriptions initiated")
});

app.post('/notifications', bodyParser.text(), (req, res) => {
    handleSubscriptions(req, io);
    res.send("success")
});

app.post('/api/upload', upload.single("file"), async (req, res) => {
    await uploadFile('karam-s3-file-upload-test-32323232', req.file.originalname, req.file.buffer);
    return res.status(200).send("Uploaded Successfully");
});

app.get("/", (req, res) => {
    res.status(200).send("server is up and running");
});

app.use("*", (req, res) => {
    res.status(404).send("NOT FOUND ERROR YOU DUMB")
});

app.use((error, req, res, next) => {
    res.status(500).send({
        message: error
    });
});


server.listen(PORT, () => {
    console.log("Server listening on Port", PORT);
});