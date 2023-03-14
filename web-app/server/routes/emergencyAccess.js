const express = require('express');
const router = express.Router();

var handler = require('./sessionKeyHandler');
var databaseHandler = require('./accessDocumentDatabase');



router.post('/', async (req, res) => {
    try {
        data = JSON.stringify(req.body);
        console.log(data);
        sessionKeyExists = await handler.verifySessionKey(req.body.patientId, req.body.sessionKey);
        if (!sessionKeyExists) {
            res.send("Incorrect");

            
        } else {
            console.log("*****************EMERGENCY ACCESS************************")
            console.log(req);

            console.log(data)
            
    
            let timestamps = await databaseHandler.EmergencyAccessQuery("patient");

            console.log(timestamps)




            res.send(timestamps);
            
        }

        
        
        
    } catch (error) {
        console.error(`Emergency Access Failed ${req.body.hospitalId}  ${req.body.patientId}: ${error}`);
        res.send("Error accessing documents");
    }
});


module.exports = router;











