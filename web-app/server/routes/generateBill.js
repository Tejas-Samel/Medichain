const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');
const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');


const mongoose = require('mongoose');
var upload = require('./uploadFile');


const mongoURI = `mongodb://127.0.0.1:27017/EHR`;
const conn = mongoose.createConnection(mongoURI);
let databaseHandler = require("./accessDocumentDatabase");


router.post('/', upload.single('file'), async (req, res) => {

    try {
        let publicId = "";
        console.log(req.body);
        console.log(req.file);

        if (req.file.filename) {
            publicId = await databaseHandler.updateDocumentIntoDatabase(req.body.patientId, "Bill", req.file.filename,req.file.path);
            console.log(publicId);
            req.body.billId = publicId;
            req.body.record = req.file.md5;

            let sessionKeyExists = await handler.verifySessionKey(req.body.hospitalId, req.body.sessionKey);
            if (!sessionKeyExists) {
                await databaseHandler.removeDocumentFromDatabase(req.body.patientId, "Bill", publicId);
                res.send("Incorrect");
            } else {
                const walletPath = path.join(process.cwd(), '../wallet');
                const wallet = new FileSystemWallet(walletPath);

                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, {
                    wallet,
                    identity: req.body.hospitalId,
                    discovery: {enabled: true, asLocalhost: true}
                });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('EHR');

                // Submit the specified transaction.
                let response = await contract.submitTransaction('generateBill', JSON.stringify(req.body));
                response = JSON.stringify(response.toString());
                console.log(response);

                // Disconnect from the gateway.
                await gateway.disconnect();

                res.send("Correct");
            }
        } else {
            res.send("Failed to upload the Bill");
        }
    } catch (error) {
        console.error(`Failed to generate Bill by hospital ${req.body.userName}: ${error}`);
        res.send("Failed to generate Bill");
    } finally {
        conn.close();
    }
});

module.exports = router;
