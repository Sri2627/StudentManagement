const { authJwt } = require("../middlewares");
const controller = require("../controllers/event.controller");


module.exports = app => {
  
    const events = require("../controllers/event.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", events.create);
  
    // Retrieve all Tutorials
    router.get("/", events.findAll);

    router.get("/sm", events.getevent);
  
    // Retrieve all published Tutorials
    router.get("/published", events.findAllPublished);
   
    // Retrieve a single Tutorial with id
    router.get("/:id", events.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", events.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", events.delete);
  
    // Create a new Tutorial
    router.delete("/", events.deleteAll);
  
    app.use("/api/events", router);
  };
  