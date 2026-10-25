const { authJwt } = require("../middlewares");
const results = require("../controllers/results.controller");


module.exports = app => {
  
    const results = require("../controllers/results.controller");
  
    var router = require("express").Router();
  
    // Create a new assignment
    router.post("/", results.create);
  
    // Retrieve all assignment
    router.get("/", results.findAll);

    router.get("/sm", results.getstudentresult);
    router.get("/sr", results.getsectioneresults);
   
    router.get("/myresults", results.getmyresults);
    router.get("/mr", results.getstudentresults);
    // Retrieve all published assignment
    router.get("/published", results.findAllPublished);
    router.get("/student", results.getstudentresults);
    
   
    // Retrieve a single assignment with id
    router.get("/:id", results.findOne);
  
    // Update a assignment with id
    router.put("/:id", results.update);
  
    // Delete a assignment with id
    router.delete("/:id", results.delete);
  
    // Create a new assignment
    router.delete("/", results.deleteAll);
  
    app.use("/api/results", router);
  };
  