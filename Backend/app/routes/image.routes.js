const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");

const uploadController = require("../controllers/upload");

let routes = app => {
 
  
  
  router.get("/", homeController.getHome);

  router.post("/upload", uploadController.uploadFiles);
  router.get("/files", uploadController.getListFiles);
 

  router.get("/files/:name", [authJwt.verifyToken], uploadController.download);
 
  return app.use("/", router);
};

module.exports = routes;
