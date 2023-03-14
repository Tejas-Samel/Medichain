const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');

router.post('/', async (req, res) => {

    try {
        console.log(req.body);
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        //now according to the various entities present check for the request type
        if (req.body.type === 'Patient'|| req.body['express'] ) {
            // console.log("INSIDE")
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.userName,
                discovery: {enabled: true, asLocalhost: true}
            });
            if (!req.body['express']) {
                req.body.id = req.body.userName;
            }
            
        }else if (req.body.type === 'Doctor') {
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.medicalRegistrationNo,
                discovery: {enabled: true, asLocalhost: true}
            });
            req.body.id = req.body.medicalRegistrationNo;
        } else if (req.body.type === 'Laboratory' || req.body.type === 'Pharmacy' || req.body.type === 'Hospital' || req.body.type === 'Researcher' || req.body.type === 'Insurance') {
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.registrationId,
                discovery: {enabled: true, asLocalhost: true}
            });
            req.body.id = req.body.registrationId;
        }

        
        let sessionKeyExists = await handler.verifySessionKey(req.body.id, req.body.sessionKey);
        if (!sessionKeyExists) {
            res.send("Incorrect");
        } else {
            console.log("***********************************************")
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('EHR');
            
            // Submit the specified transaction.
            let response;
            if(!req.body['express']){
            response= await contract.submitTransaction('getModifiedAsset', JSON.stringify(req.body));
            }else{
                req.body.id = req.body.userName
                
            response= await contract.submitTransaction('getModifiedAsset', JSON.stringify(req.body));
            }
            response = JSON.stringify(response.toString());
            
            console.log(response);
            // Disconnect from the gateway.
            await gateway.disconnect();
            res.send(response);
        }

    } catch (error) {
        console.error(`Failed to fetch asset  the user : ${error}`);
        res.send("Failed to fetch asset");
    }
});


module.exports = router;
