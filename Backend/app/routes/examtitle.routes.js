const { authJwt } = require("../middlewares");
 


module.exports = app => {
  
    const examtitles = require("../controllers/examtitles.controller");
  
    var router = require("express").Router();
  
    // Create a new assignment
    router.post("/", examtitles.create);
  
    // Retrieve all assignment
    router.get("/", examtitles.findAll);
    router.get("/se", examtitles.getsectionexams);
 
   
    // Retrieve a single assignment with id
    router.get("/:id", examtitles.findOne);
  
    // Update a assignment with id
    router.put("/:id", examtitles.update);
  
    // Delete a assignment with id
    router.delete("/:id", examtitles.delete);
  
    // Create a new assignment
    router.delete("/", examtitles.deleteAll);
  
    app.use("/api/examtitles", router);
  };
  