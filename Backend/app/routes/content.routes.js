const { authJwt } = require("../middlewares");
const controller = require("../controllers/content.controller");


module.exports = app => {
  
    const content = require("../controllers/content.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", content.create);
  
    // Retrieve all Tutorials
    router.get("/", content.findAll);

    router.get("/sm", content.getevent);
  
    // Retrieve all published Tutorials
    router.get("/published", content.findAllPublished);
   
    // Retrieve a single Tutorial with id
    router.get("/:id", content.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", content.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", content.delete);
  
    // Create a new Tutorial
    router.delete("/", content.deleteAll);
  
    app.use("/api/content", router);
  };
  