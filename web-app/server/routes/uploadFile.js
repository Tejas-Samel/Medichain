const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
let Grid = require('gridfs-stream');
const mongoURI = `mongodb://127.0.0.1:27017/EHR`;
const conn = mongoose.createConnection(mongoURI);
let gfs;
let handler = require("./accessDocumentDatabase");

//
// const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if (err) {
//                     return reject(err);
//                 }
//
//                 const filename = file.originalname;
//                 const fileInfo = {
//                     filename: filename,
//                     bucketName: 'EHRCollection',
//                     metadata: {documentType: 'EHR'},
//                 };
//                 resolve(fileInfo);
//             });
//         });
//     }
// });
// const ehrRecords = multer({storage});
var storage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './uploads');  
    },  
    filename: function (req, file, callback) {  
      callback(null, file.originalname);  
    }  
  });  
var upload = multer({ storage : storage}).single('myfile');  
    
// Route for file upload
// router.post('/', ehrRecords.single('file'), async (req, res) => {
router.post('/', async (req, res) => {
    console.log(req.body);
    console.log(req);
    upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }  
        res.end("File is uploaded successfully!");  
    });
    // if (req.file.filename) {
    //     let publicId = await handler.updateDocumentIntoDatabase("Rahul", "EHR", req.file.filename);
    //     console.log(publicId);
    // }
    // res.send(req.file);
    // gfs = Grid(conn.db, mongoose.mongo);
    // gfs.collection(req.body.collectionName);
    // console.log(gfs);
    // let fileSchema = {
    //     filename: "image.jpg",
    //     contentType: "image/jpeg",
    //     metadata: {
    //         documentType: req.body.type
    //     }
    // };
    // await gfs.files.findOne(fileSchema, async (err, file) => {
    //     // Check if file is the
    //     if (!file || file.length === 0) {
    //         return res.status(404).json({
    //             err: 'No file exists'
    //         });
    //     }
    //     // Check if image
    //     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
    //         // Read output to browser
    //         const readstream = await gfs.createReadStream({filename: file.filename});
    //         readstream.pipe(res);
    //     } else {
    //         res.status(404).json({
    //             err: 'Not an image'
    //         });
    //     }
    // });

});
module.exports = router;
