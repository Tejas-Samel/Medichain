const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');
const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');

const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
let Grid = require('gridfs-stream');
const mongoURI = `mongodb://127.0.0.1:27017/EHR`;
const conn = mongoose.createConnection(mongoURI);
let gfs;
let databaseHandler = require("./accessDocumentDatabase");

// conn.once('open', () => {
//     // Init stream
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('EHRCollection');
// });

// const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if (err) {
//                     return reject(err);
//                 }

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
var storage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './uploads');  
    },  
    filename: function (req, file, callback) {  
      callback(null, file.originalname);  
    }  
  });  
var upload = multer({ storage : storage}).single('myfile');  
    
const EHRCollection = multer({storage});

router.post('/', EHRCollection.single('file'), async (req, res) => {
    console.log('******************request body****************');
    
    try {
        let publicId = "";
        // console.log(req.body);
        // console.log(req.body.patientId);


        // upload(req,res,function(err) {  
        //     if(err) {  
        //         return res.end("Error uploading file.");  
        //     }
              
        //     res.end("File is uploaded successfully!");  
        // });
        // console.log(req.file.path);
        console.log('*******Request body end************');

        if (req.file.filename) {
            publicId = await databaseHandler.updateDocumentIntoDatabase(req.body.patientId, "EHR", req.file.filename,req.file.path);
            // console.log('************public****');
            // console.log(req.file.path);
            // console.log(publicId);
            // console.log('*********id************');

            req.body.ehrId = publicId;
            req.body.record = req.file.md5;

            let sessionKeyExists = await handler.verifySessionKey(req.body.doctorId, req.body.sessionKey);
            if (!sessionKeyExists) {
                await databaseHandler.removeDocumentFromDatabase(req.body.patientId, "EHR", publicId);
                res.send("Incorrect");
            } else {
                

                const walletPath = path.join(process.cwd(), '../wallet');
                const wallet = new FileSystemWallet(walletPath);

                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, {
                    wallet,
                    identity: req.body.doctorId,
                    discovery: {enabled: true, asLocalhost: true}
                });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('EHR');
                console.log(JSON.stringify(req.body));
                // Submit the specified transaction.
                let response = await contract.submitTransaction('createEhr', JSON.stringify(req.body));
                response = JSON.stringify(response.toString());
                console.log(response);

                // Disconnect from the gateway.
                await gateway.disconnect();

                res.send("Correct");
            }
        } else {
            res.send("Failed to upload the health record");
        }
    } catch (error) {
        console.error(`Failed to generate EHR by doctor ${req.body.userName}: ${error}`);
        res.send("Failed to generate an EHR");
    } finally {
        conn.close();
    }
});

module.exports = router;
