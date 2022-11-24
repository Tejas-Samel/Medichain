const multer = require('multer');
const express = require('express');

var filestorage =   multer.diskStorage({ 
    
    destination: function (req, file, callback) { 
      // console.log(req);  
      callback(null, './uploads');  
    },  
    filename: function (req, file, callback) { 

      let name= Date.now().toString()+'--'+ String(file.originalname);
      console.log('NAME');
      // console.log()

      callback(null,name);  
    }  
  });  
var upload = multer({ storage : filestorage});  

// exports.filestorage = filestorage;
module.exports = upload;
