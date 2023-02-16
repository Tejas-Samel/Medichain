const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');


router.post('/', async (req, res) => {

    try {
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: req.body.id,
            discovery: {enabled: true, asLocalhost: true}
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('EHR');

        // Submit the specified transaction.
        let response = await contract.submitTransaction('verifyPassword', JSON.stringify(req.body));
        response = JSON.parse(response.toString());
        console.log(response);
        
        // Disconnect from the gateway.
        await gateway.disconnect();

        if (response === true) {
            let sessionKey = await handler.generateSessionKey(req.body.id);
            console.log(sessionKey);
            let response = {
                "data": sessionKey
            };
            res.send(response);
        } else {
            let response = {
                "data": "Incorrect"
            };
            res.send(response);
        }

    } catch (error) {
        console.error(`Failed to verify password for the user ${req.body.id}: ${error}`);
        let response = {
            "data": "Failed to verify password"
        };
        res.send(response);
    }
});


module.exports = router;
