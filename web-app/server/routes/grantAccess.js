const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');


router.post('/', async (req, res) => {

    try {
        let sessionKeyExists = await handler.verifySessionKey(req.body.patientId, req.body.sessionKey);
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

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('EHR');
            let response = '';
            // Submit the specified transaction.
            console.log(req.body);
            if (req.body.requestType !== "direct") {
                response = await contract.submitTransaction('grantAccess', JSON.stringify(req.body));
            } else {
                response = await contract.submitTransaction('grantDirectAccess', JSON.stringify(req.body));
            }
            response = JSON.stringify(response.toString());
            console.log(response);

            // Disconnect from the gateway.
            await gateway.disconnect();

            res.send("Correct");
        }

    } catch (error) {
        console.error(`Failed to grant access for the patient ${req.body.patientId}: ${error}`);
        res.send("Failed to grant access");
    }
});


module.exports = router;
