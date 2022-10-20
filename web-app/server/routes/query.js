// noinspection BadExpressionStatementJS
'use-strict';
const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');

async function main() {

    try {

        const walletPath = path.join(process.cwd(), '../../wallet');
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

        let asset = {
            address: 'Kavi Nagar Gwalior',
            appointments: [],
            bills: ['123'],
            doctors: ['rahul'],
            laboratories: [],
            name: 'Rohini Hospital ',
            patients: [],
            pharmacies: [],
            phone: '9644143960',
            registrationId: '964414396011',
            type: 'Hospital',
            userName: 'rahulparihar',
            sessionKey: 'c65d75db153800516e3622fcd02c0b56e754cbf2a311e1ffcfa6f17ae29b15d6',
            password: 'Rahul@123',
            id: 'rahulparihar'
        };
        let a = '10';
        let b = '20';
        console.log(+a + +b);
        let c = '';
        c = +a + +b;
        console.log(c);
        console.log(typeof asset.doctors);
        let documentArray = asset.ehrs || asset.doctors || asset.medicineReceipts || asset.labRecords;
        let documentType = asset.type + 'Collection';
        console.log(documentType);
        console.log(documentArray);
        let response = ["Incorrect"];
        response = await contract.evaluateTransaction('getModifiedAsset', JSON.stringify(asset));
        // var patient = 'Patient';
        // console.log(typeof patient);
        // let requestType = 'pariharrahul2002';
        // if (requestType === 'pariharrahul2002') {
        //     let queryString = {
        //         "selector": {
        //             "userName": requestType
        //         }
        //     };
        //
        //     response = await contract.evaluateTransaction('queryWithQueryString', JSON.stringify(queryString));
        //     response = JSON.parse(response.toString());
        //     console.log(response);
        // }
        console.log(JSON.parse(response.toString()));
        gateway.disconnect();
        //
        // let sessionKey = await handler.generateSessionKey(asset.id);
        // console.log(sessionKey);
        // response = await handler.verifySessionKey(asset.id, sessionKey);
        // console.log(response);
        // await handler.removeSessionKey(asset.id, sessionKey);


    } catch (error) {
        console.error(`Failed to fetch data ${error}`);
        process.exit(1);
    }
}

main();
