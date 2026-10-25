const express = require('express');
const imageRouter = express.Router();
const mongoose = require('mongoose');
const Image = require('../models/image.model');
const config = require('../config/db.config');
const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");


module.exports = (upload) => {
    const url = config.murl;
    const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

    let gfs;

    connect.once('open', () => {
        // initialize stream
        gfs = new mongoose.mongo.GridFSBucket(connect.db, {
            bucketName: "uploads"
        });
    });



    
    exports.uploadFiles = async (req, res) => {


        exports.storage = new GridFsStorage({
            url: config.url + config.database,
            options: { useNewUrlParser: true, useUnifiedTopology: true },
            file: (req, file) => {
              const match = ["image/png", "image/jpeg" ,"application/pdf","text/plain", "video/mp4"];
          
              if (match.indexOf(file.mimetype) === -1) {
                const filename = `${Date.now()}-srikanth-${file.originalname}`;
                return filename;
              }
          
              return {
                bucketName: config.imgBucket,
                //filename: `${file.originalname}`
                filename: `${Date.now()}-srikanth-${file.originalname}`
              };
            }
          });
          
          var uploadFiles = multer({ storage: storage }).array("file", 10);
          util.promisify(uploadFiles);
          

        // Create a Tutorial
         
      };

      


}