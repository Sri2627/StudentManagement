const { authJwt } = require("../middlewares");
const controller = require("../controllers/event.controller");


module.exports = app => {
  
    const syllabus = require("../controllers/syllabus.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", syllabus.create);
  
    // Retrieve all Tutorials
    router.get("/", syllabus.findAll);

    router.get("/sm", syllabus.getevent);
  
    // Retrieve all published Tutorials
    router.get("/published", syllabus.findAllPublished);
   
    // Retrieve a single Tutorial with id
    router.get("/:id", syllabus.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", syllabus.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", syllabus.delete);
  
    // Create a new Tutorial
    router.delete("/", syllabus.deleteAll);
  
    app.use("/api/syllabus", router);
  };
  