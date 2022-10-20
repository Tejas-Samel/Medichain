const express = require('express');
const router = express.Router();

const path = require('path');
var handler = require('./sessionKeyHandler');


router.post('/', async (req, res) => {

    try {
        await handler.removeSessionKey(req.body.id, req.body.sessionKey);
        res.send('Correct');
    } catch (error) {
        console.log('failed to log out' + error);
        res.send('Incorrect');
    }
});

module.exports = router;
