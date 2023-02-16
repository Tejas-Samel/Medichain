const express = require('express');
const router = express.Router();
const path = require('path');
var databaseHandler = require('./accessDocumentDatabase');
router.post('/', async (req, res) => {
    try {
        // console.log(req.body);
        let documentId = await databaseHandler.getFileDetailsAndDocumentId(req.body.patientId, req.body.documentId, req.body.type);
        console.log('----------------------------------');        
        console.log(documentId);
        console.log('----------------------------------');

        file_path =  __dirname.replace("/routes","") + '/uploads/' + String(documentId);
        // file_path = '/home/tejas/Development/ehr/web-app/server/uploads/1676440587793--cat.png'
        console.log(__dirname);
        res.sendFile(file_path)
            
            
            // Check if image
            // if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {

                
            // } else {
            //     res.status(404).json({
            //         err: 'Not an image'
            //     });
            // }
            // await conn.close();
        
    } catch (e) {
        console.log(e);
    }

});
module.exports = router;
