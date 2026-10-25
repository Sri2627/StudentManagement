const { authJwt } = require("../middlewares");
const controller = require("../controllers/asmt.controller");


module.exports = app => {
  
    const assignments = require("../controllers/asmt.controller");
  
    var router = require("express").Router();
  
    // Create a new assignment
    router.post("/", assignments.create);
  
    // Retrieve all assignment
    router.get("/", assignments.findAll);

    router.get("/sm", assignments.getstudentmessges);
  
    // Retrieve all published assignment
    router.get("/published", assignments.findAllPublished);
   
    // Retrieve a single assignment with id
    router.get("/:id", assignments.findOne);
  
    // Update a assignment with id
    router.put("/:id", assignments.update);
  
    // Delete a assignment with id
    router.delete("/:id", assignments.delete);
  
    // Create a new assignment
    router.delete("/", assignments.deleteAll);
  
    app.use("/api/assignments", router);
  };
  