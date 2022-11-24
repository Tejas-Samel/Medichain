const express = require('express');
const router = express.Router();
const path = require('path');
var databaseHandler = require('./accessDocumentDatabase');
router.post('/', async (req, res) => {
    try {
        // console.log(req.body);
        let documentId = await databaseHandler.getFileDetailsAndDocumentId(req.body.patientId, req.body.documentId, req.body.type);
        // console.log('----------------------------------');        
        // console.log(documentId);
        // console.log('----------------------------------');

        if (documentId) {
            let fileSchema = {
                filename: documentId,
                contentType: "image/jpeg",
                metadata: {
                    documentType: req.body.type
                },
                document_path : documentId.document_path,
            };
            
            
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
