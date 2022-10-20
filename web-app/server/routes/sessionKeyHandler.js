'use strict';

const mongo = require('mongodb').MongoClient;
const crypto = require('crypto');
const url = 'mongodb://127.0.0.1:27017';
let client;

function encrypt(text) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), key: key.toString('hex')};
}

function decrypt(encryptedKey, text) {

    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(encryptedKey, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(text.key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


async function generateSessionKey(userId) {
    let sessionKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let encrypted = encrypt(sessionKey);
    try {
        let user = {
            sessionKey: sessionKey,
            userId: userId,
            key: encrypted.key,
            iv: encrypted.iv
        };
        client = await mongo.connect(url);
        client.db('EHR').collection('activeUsersList').insertOne(user);
        console.log("the sessionKey is successfully stored " + sessionKey);
        return encrypted.encryptedData.toString();
    } catch (error) {
        console.log("creation or storage of the session key failed");
    } finally {
        await client.close();
    }
}

async function verifySessionKey(userId, sessionKey) {
    try {
        let userPresent = false;
        let user = {
            userId: userId
        };
        client = await mongo.connect(url);
        let result = await client.db('EHR').collection('activeUsersList').findOne(user);
        let decryptedKey = decrypt(sessionKey, result);
        if (decryptedKey === result.sessionKey) {
            userPresent = true;
        }
        return userPresent;
    } catch (error) {
        console.log("verification of the session key failed" + error);
    } finally {
        await client.close();
    }
}

async function removeSessionKey(userId, sessionKey) {
    try {
        client = await mongo.connect(url);
        let user = {
            userId: userId
        };
        let result = await client.db('EHR').collection('activeUsersList').findOne(user);
        let decryptedKey = decrypt(sessionKey, result);
        if (decryptedKey === result.sessionKey) {
            await client.db('EHR').collection('activeUsersList').deleteOne(user);
            console.log('removed the sessionKey ');
        } else {
            throw new Error(`user cant be removed`);
        }

    } catch (error) {
        console.log("removal of the session key failed" + error);
    } finally {
        await client.close();
    }
}

module.exports = {generateSessionKey, verifySessionKey, removeSessionKey};