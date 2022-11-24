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
            address: 'Kokila ben hospital',
            appointments: [],
            bills: ['123'],
            doctors: ['prathamesh'],
            laboratories: [],
            name: 'kokilaben Hospital ',
            patients: [],
            pharmacies: [],
            phone: '91 9868654376',
            registrationId: '964414396011',
            type: 'Hospital',
            userName: 'prathamesh',
            sessionKey: 'c65d75db153800516e3622fcd02c0b56e754cbf2a311e1ffcfa6f17ae29b15d6',
            password: 'Prath@123',
            id: 'Prathamesh'
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

        console.log(JSON.parse(response.toString()));
        gateway.disconnect();
        //
    

    } catch (error) {
        console.error(`Failed to fetch data ${error}`);
        process.exit(1);
    }
}

main();
