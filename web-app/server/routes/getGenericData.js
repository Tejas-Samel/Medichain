const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');

router.post('/', async (req, res) => {

    try {
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`************** Wallet path: ${walletPath} **************************`);


        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('Please run enrollAdmin.js file first ... ');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, {wallet, identity: 'admin', discovery: {enabled: true, asLocalhost: true}});

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.

        const contract = network.getContract('EHR');
        let requestType = req.body.dataType;
        console.log(req.body.dataType);
        let response = ["Incorrect"];
        if (requestType === 'Hospital' || requestType === "Insurance") {
            let queryString = {
                "selector": {
                    "type": requestType
                }
            };
            response = await contract.evaluateTransaction('queryWithQueryString', JSON.stringify(queryString));
            response = JSON.parse(response.toString());
            console.log(response);
        } else if (requestType === 'Pharmacy' || requestType === 'Laboratory') {
            let queryString = {
                "selector": {
                    "type": requestType,
                    "hospitalId": req.body.hospitalId
                }
            };
            response = await contract.evaluateTransaction('queryWithQueryString', JSON.stringify(queryString));
            response = JSON.parse(response.toString());
        }
        for (let i = 0; i < response.length; i++) {
            delete response[i].Record.password;
            delete response[i].Record.appointments;
            delete response[i].Record.patients;
            delete response[i].Record.patientsAttended;
            delete response[i].Record.patientsVisited;
            delete response[i].Record.bills;
            delete response[i].Record.sessionKey;
        }
        console.log(response);
        res.send(response);
        gateway.disconnect();
    } catch (error) {
        console.log('failed to fetch generic data' + error);
        res.send(['Incorrect']);
    }
});

module.exports = router;
