const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');
var databaseHandler = require('./accessDocumentDatabase');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');

router.post('/', async (req, res) => {

    try {
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = new FileSystemWallet(walletPath);
        let id;
        console.log(req.body);
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        //now according to the various entities present check for the request type
        if (req.body.type === 'Doctor') {
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.medicalRegistrationNo,
                discovery: {enabled: true, asLocalhost: true}
            });
            id = req.body.medicalRegistrationNo;
        } else if (req.body.type === 'Patient') {
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.userName,
                discovery: {enabled: true, asLocalhost: true}
            });
            id = req.body.userName;
        } else if (req.body.type === 'Laboratory' || req.body.type === 'Pharmacy' || req.body.type === 'Hospital' || req.body.type === 'Researcher' || req.body.type === 'Insurance') {
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.registrationId,
                discovery: {enabled: true, asLocalhost: true}
            });
            id = req.body.registrationId;
        }
        let sessionKeyExists = await handler.verifySessionKey(id, req.body.sessionKey);
        if (!sessionKeyExists) {
            res.send("Incorrect");
        } else {
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('EHR');

            //now according to the various entities present check for the request type
            let response;
            console.log(req.body);
            if (req.body.type === 'Doctor') {
                // Submit the specified transaction.
                req.body.doctorId = req.body.medicalRegistrationNo;
                if (req.body.listType === 'patients') {
                    console.log("doctor side");
                    let assetsArray = req.body.patients;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readDoctorAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (typeof responseArray === 'object') {
                            response.push(responseArray);
                        }
                    }
                } else {
                    response = await contract.submitTransaction('readDoctorAssets', JSON.stringify(req.body));
                    response = JSON.stringify(response.toString());
                }
            } else if (req.body.type === 'Patient') {
                // Submit the specified transaction.
                console.log("here");
                req.body.patientId = req.body.userName;
                if (req.body.listType === 'requesters' || req.body.listType === 'permissionedIds') {
                    console.log("asldnk");
                    let assetsArray = req.body.requesters || req.body.permissionedIds;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readPatientAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (responseArray.type) {
                            response.push(responseArray);
                        }
                    }
                } else {
                    response = await contract.submitTransaction('readPatientAssets', JSON.stringify(req.body));
                    response = JSON.stringify(response.toString());
                }
            } else if (req.body.type === 'Laboratory') {
                // Submit the specified transaction.
                req.body.laboratoryId = req.body.registrationId;
                if (req.body.listType === 'patients') {
                    console.log("laboratory side");
                    let assetsArray = req.body.patients;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readLaboratoryAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (typeof responseArray === 'object') {
                            response.push(responseArray);
                        }
                    }
                } else {
                    response = await contract.submitTransaction('readLaboratoryAssets', JSON.stringify(req.body));
                    response = JSON.stringify(response.toString());
                }
            } else if (req.body.type === 'Pharmacy') {
                // Submit the specified transaction.
                req.body.pharmacyId = req.body.registrationId;
                if (req.body.listType === 'patients') {
                    console.log("pharmacy side");
                    let assetsArray = req.body.patients;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readPharmacyAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (typeof responseArray === 'object') {
                            response.push(responseArray);
                        }
                    }
                } else {
                    response = await contract.submitTransaction('readPharmacyAssets', JSON.stringify(req.body));
                    response = JSON.stringify(response.toString());
                }
            } else if (req.body.type === 'Hospital') {
                // Submit the specified transaction.
                req.body.hospitalId = req.body.registrationId;
                if (req.body.listType === 'patients' || req.body.listType === 'pharmacies' || req.body.listType === 'laboratories' || req.body.listType === 'doctors' || req.body.listType === 'patientsVisited') {
                    console.log("Hospital side");
                    let assetsArray = req.body.patients || req.body.doctors || req.body.pharmacies || req.body.laboratories || req.body.patientsVisited;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readHospitalAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (typeof responseArray === 'object') {
                            response.push(responseArray);
                        }
                    }
                } else if (req.body.listType === 'bills') {
                    let documentArray = req.body.bills;
                    let documentsDetails = [];
                    for (let i = 0; i < documentArray.length; i++) {
                        // Submit the specified transaction.
                        req.body.assetId = documentArray[i];
                        let response = await contract.submitTransaction('readHospitalAssets', JSON.stringify(req.body));
                        response = JSON.parse(response.toString());
                        console.log(response);
                        if (response.record) {
                            let collectionName = response.type + 'Collection';
                            let documentType = response.type;
                            let documentId = response.billId;
                            console.log(collectionName + " " + documentType + " " + documentId);
                            let documentStorageId = await databaseHandler.getFileDetailsAndDocumentId(response.patientId, documentId, documentType);
                            console.log(documentStorageId);
                            let isCorrect = await databaseHandler.verifyFileExistenceAndHash(documentStorageId, documentType, collectionName);
                            console.log(isCorrect);
                            if (documentStorageId && isCorrect) {
                                delete response.record;
                                documentsDetails.push(response);
                                console.log("here");
                            }
                        }
                    }
                    response = documentsDetails;
                } else {
                    response = await contract.submitTransaction('readHospitalAssets', JSON.stringify(req.body));
                    response = JSON.stringify(response.toString());
                }
            } else if (req.body.type === 'Researcher') {
                // Submit the specified transaction.
                req.body.researcherId = req.body.registrationId;
                if (req.body.listType === 'patients') {
                    console.log("Researcher side");
                    let assetsArray = req.body.patients;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readResearcherAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (typeof responseArray === 'object') {
                            response.push(responseArray);
                        }
                    }
                } else {
                    response = await contract.submitTransaction('readResearcherAssets', JSON.stringify(req.body));
                    response = JSON.stringify(response.toString());
                }
            } else if (req.body.type === 'Insurance') {
                // Submit the specified transaction.
                req.body.insurerId = req.body.registrationId;
                if (req.body.listType === 'patients') {
                    console.log("Insurance side");
                    let assetsArray = req.body.patients;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readInsurerAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (typeof responseArray === 'object') {
                            response.push(responseArray);
                        }
                    }
                } else {
                    response = await contract.submitTransaction('readInsurerAssets', JSON.stringify(req.body));
                    response = JSON.stringify(response.toString());
                }
            }
            console.log(response);

            // Disconnect from the gateway.
            await gateway.disconnect();

            res.send(response);
        }
    } catch (error) {
        console.error(`Failed to fetch asset for the user : ${error}`);
        res.send("Failed to fetch asset");
    }
});


module.exports = router;
