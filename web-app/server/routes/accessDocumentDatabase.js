'use strict';

async function updateDocumentIntoDatabase(userName, documentType, documentId,document_path) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            userName: userName,
            documentType: documentType,
            documentId: documentId,
            document_path:document_path,
            publicId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        };
        

        console.log('----------------------In DataBase---------------------------------');
        console.log(userSchema)
        console.log('--------------------------------------------------------');

        client = await mongo.connect(url);
        client.db('EHR').collection(String(userName)).insertOne(userSchema);
        console.log("the public key is successfully stored " + userSchema.publicId);
        await client.close();
        return userSchema.publicId;
    } catch (e) {
        console.log(e);
    }
}

async function removeDocumentFromDatabase(userName, documentType, documentId) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            userName: userName,
            documentType: documentType,
            publicId: documentId
        };
        client = await mongo.connect(url);
        await client.db('EHR').collection(String(userName)).deleteOne(userSchema);
        console.log('removed the Document due to unsuccessful generation of EHR');
        await client.close();
    } catch (e) {
        console.log(e);
    }
}

async function verifyFileExistenceAndHash(documentId, documentType, collectionName) {
    try {
        const mongoose = require('mongoose');
        let Grid = require('gridfs-stream');
        const mongoURI = `mongodb://127.0.0.1:27017/EHR`;
        const conn = mongoose.createConnection(mongoURI);
        let gfs;

        await conn.once('open', () => {
            // Init stream
            gfs = Grid(conn.db, mongoose.mongo);
            gfs.collection(collectionName);
        });
        let documentSchema = {
            filename: documentId,
            collectionName:collectionName,
            metadata: {
                documentType: documentType
            }
        };
        console.log('Inside accessdoc')
        console.log(documentSchema);
        let file = await gfs.files.findOne(documentSchema);
        conn.close();
        console.log(file);
        return !(!file || file.length === 0);
    } catch (e) {
        console.log(e);
    }

}

async function getFileDetailsAndDocumentId(userName, publicId, documentType) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            userName: userName,
            publicId: publicId,
        };
        // console.log('-------------US---------------------');
        // console.log(userSchema);
        // console.log('----------------------------------');

        client = await mongo.connect(url);
        let result = await client.db('EHR').collection(String(userName)).findOne(userSchema);
        console.log('-----------result-----------');

        console.log(result);
        let documentId = '';
        if (result && result.userName) {
            documentId = result.documentId;
        }
        await client.close();
        return documentId;
    } catch (e) {
        console.log(e);
    }
}

async function registerNewUser(id, name, type) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            userId: id,
            type: type,
            name: name,
        };
        console.log('------------registerNewUser-----------------')
        console.log(userSchema);
        client = await mongo.connect(url);
        let result = await client.db('EHR').collection('registeredUserList').insertOne(userSchema);
        await client.close();
        return result;
    } catch (e) {
        console.log(e);
    }
}

async function fetchUsersByType(type) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            type: type,
        };
        console.log(userSchema);
        client = await mongo.connect(url);
        let result = await client.db('EHR').collection('registeredUserList').find(userSchema).toArray();
        console.log(result);
        await client.close();
        return result;
    } catch (e) {
        console.log(e);
    }
}

async function fetchUserByUserName(userName) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            userId: userName,
        };
        console.log(userSchema);
        client = await mongo.connect(url);
        let result = await client.db('EHR').collection('registeredUserList').findOne(userSchema);
        console.log(result);
        await client.close();
        return result;
    } catch (e) {
        console.log(e);
    }
}

async function EmergencyAccess(hospitalId,userName){
    try{
    const mongo = require('mongodb').MongoClient;
    const url = 'mongodb://127.0.0.1:27017';
    let client;
    client = await mongo.connect(url);
    let data={
        "hospitalId":hospitalId,
        "time": String(Date().valueOf()),
        "emergencyaccess":true,
    }
    let result = await client.db('EHR').collection(String(userName)).insertOne(data);
    await client.close();
    return result;
    }catch(e){
        
        console.log(e);
        return "ERROR"
    }
}

async function EmergencyAccessQuery(userName){
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        client = await mongo.connect(url);
        let result = await client.db('EHR').collection(String(userName)).find({"emergencyaccess":true}).sort({"time":-1}).toArray();
        return result;
        
    } catch (error) {
        console.log(e);
        return "ERROR"
    }
}





module.exports = {
    updateDocumentIntoDatabase,
    removeDocumentFromDatabase,
    verifyFileExistenceAndHash,
    getFileDetailsAndDocumentId,
    fetchUsersByType,
    fetchUserByUserName,
    registerNewUser,
    EmergencyAccess,
    EmergencyAccessQuery,
};