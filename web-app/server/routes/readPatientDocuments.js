const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');
var databaseHandler = require('./accessDocumentDatabase');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');


router.post('/', async (req, res) => {
    console.log('**********Read Documents**************');
    try {
        // console.log("hospitalId"in req.body);
        let sessionKeyExists =false;
        if(req.body['express']){
        sessionKeyExists = await handler.verifySessionKey(req.body.hospitalId, req.body.sessionKey);

        }else{
        sessionKeyExists = await handler.verifySessionKey(req.body.patientId, req.body.sessionKey);
        }
        if (!sessionKeyExists) {
            res.send("Incorrect");
        } else {
            const walletPath = path.join(process.cwd(), '../wallet');
            const wallet = new FileSystemWallet(walletPath);
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.patientId,
                discovery: {enabled: true, asLocalhost: true}
            });
            // console.log(gateway);
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('EHR');
            
            if(req.body['express']){
            let documentStorageId = await databaseHandler.EmergencyAccess(req.body.hospitalId,req.body.patientId);
            // console.log(documentStorageId);

            }

            /*
            get the type of document in the form of an array
            and continuously check for the presence of the array in the list
            while checking for the md5 hash as well
            if everything is fine them return the document to the user
            need listsType and the array to get the data

            name of various collection Name

             */
            let documentArray = req.body.ehrs || req.body.bills || req.body.medicineReceipts || req.body.labRecords;
            console.log(documentArray);

            let documentsDetails = [];
            for (let i = 0; i < documentArray.length; i++) {
                // Submit the specified transaction.
                req.body.assetId = documentArray[i];
                let response = await contract.submitTransaction('readPatientAssets', JSON.stringify(req.body));
                response = JSON.parse(response.toString());
                console.log('---------response--------');
                console.log(response);
                let documentId = response.ehrId || response.labRecordId || response.medicineReceiptId || response.billId||response.record;

                if (documentId) {
                    let collectionName = response.type + 'Collection';
                    let documentType = response.type;
                    // console.log(collectionName + " " + documentType + " " + documentId);
                    let documentStorageId = await databaseHandler.getFileDetailsAndDocumentId(response.patientId, documentId, documentType);
                    console.log('******storageid****');
                    console.log(documentStorageId);
                    // console.log(process.cwd());
                    let isCorrect = await databaseHandler.verifyFileExistenceAndHash(documentStorageId, documentType, collectionName);
                    // console.log(isCorrect);
                    if (documentStorageId) {
                        delete response.record;
                        documentsDetails.push(response);
                        console.log(documentsDetails)
                        console.log("here");
                    }
                }
            }
            // Disconnect from the gateway.
            await gateway.disconnect();
            console.log('-------Docdetails-------')
            console.log(documentsDetails);
            res.send(documentsDetails);
        }

    } catch (error) {
        console.error(`Failed fetch documents for the user  ${req.body.patientId}: ${error}`);
        res.send("Failed to fetch documents");
    }
});


module.exports = router;
