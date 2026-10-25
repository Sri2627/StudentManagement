const { authJwt } = require("../middlewares");
 

module.exports = app => {
  
    const subjects = require("../controllers/subject.controller");
  
    var router = require("express").Router();
  
    // Create a new section
    router.post("/", subjects.create);
  
    // Retrieve all sections
    router.get("/", subjects.findAll);
    
   
    // Retrieve a single section with id
    router.get("/:id", subjects.findOne);
  
    // Update a section with id
    router.put("/:id", subjects.update);
  
    // Delete a section with id
    router.delete("/:id", subjects.delete);
  
    // Create a new section
    router.delete("/", subjects.deleteAll);
  
    app.use("/api/subjects", router);
  };
  