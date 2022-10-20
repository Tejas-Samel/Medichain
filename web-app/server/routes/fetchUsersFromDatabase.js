const express = require('express');
const router = express.Router();

const path = require('path');
const databaseHandler = require('./accessDocumentDatabase');


router.post('/', async (req, res) => {

    try {
        let response;
        if (req.body.query === 'list') {
            response = [];
            response = await databaseHandler.fetchUsersByType(req.body.type);
            res.send(response);
        } else if (req.body.query === 'single') {
            response = '';
            response = await databaseHandler.fetchUserByUserName(req.body.id);
            res.send(response);
        } else {
            res.send('Incorrect');
        }
    } catch (error) {
        console.log('failed to fetch data' + error);
        res.send('Incorrect');
    }
});

module.exports = router;
