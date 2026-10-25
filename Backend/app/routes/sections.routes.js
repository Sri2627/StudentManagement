const { authJwt } = require("../middlewares");
 

module.exports = app => {
  
    const sections = require("../controllers/section.controller");
  
    var router = require("express").Router();
  
    // Create a new section
    router.post("/", sections.create);
  
    // Retrieve all sections
    router.get("/", sections.findAll);
    
   
    // Retrieve a single section with id
    router.get("/:id", sections.findOne);
  
    // Update a section with id
    router.put("/:id", sections.update);
  
    // Delete a section with id
    router.delete("/:id", sections.delete);
  
    // Create a new section
    router.delete("/", sections.deleteAll);
  
    app.use("/api/sections", router);
  };
  