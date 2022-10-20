const express = require('express');
const router = express.Router();
const path = require('path');
var databaseHandler = require('./accessDocumentDatabase');
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        let documentId = await databaseHandler.getFileDetailsAndDocumentId(req.body.patientId, req.body.documentId, req.body.type);
        if (documentId) {
            let fileSchema = {
                filename: documentId,
                contentType: "image/jpeg",
                metadata: {
                    documentType: req.body.type
                }
            };
            const mongoose = require('mongoose');
            let Grid = require('gridfs-stream');
            const mongoURI = `mongodb://127.0.0.1:27017/EHR`;
            const conn = mongoose.createConnection(mongoURI, {
                poolSize: 10,
                bufferMaxEntries: 0,
                reconnectTries: 5000,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            let gfs;
            let collectionName = req.body.type + 'Collection';
            await conn.once('open', () => {
                // Init stream
                gfs = Grid(conn.db, mongoose.mongo);
                gfs.collection(collectionName);
            });

            console.log(fileSchema);
            let file = await gfs.files.findOne(fileSchema);
            console.log(file);
            console.log(file.contentType);
            // Check if image
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                // Read output to browser
                const readstream = await gfs.createReadStream({filename: file.filename});
                readstream.pipe(res);
            } else {
                res.status(404).json({
                    err: 'Not an image'
                });
            }
            // await conn.close();
        }
    } catch (e) {
        console.log(e);
    }


});
module.exports = router;
