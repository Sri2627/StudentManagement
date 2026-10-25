const express = require("express");
const router = express.Router();
const{ authJwt }= require("../middleware/");
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");

let routes = app => {

  router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  
  
  router.get("/", homeController.getHome);

  router.post("/upload", uploadController.uploadFiles);
  router.get("/files", uploadController.getListFiles);
 

  router.get("/files/:name", uploadController.download);
 
  return app.use("/", router);
};

module.exports = routes;

