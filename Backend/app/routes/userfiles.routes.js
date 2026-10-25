const { authJwt } = require("../middlewares");
const controller = require("../controllers/asmt.controller");


module.exports = app => {
  
    const userfiles = require("../controllers/asmt.controller");
  
    var router = require("express").Router();
  
    // Create a new assignment
    router.post("/", userfiles.create);
  
    // Retrieve all assignment
    router.get("/", userfiles.findAll);

    router.get("/sm", userfiles.getstudentmessges);
  
    // Retrieve all published assignment
    router.get("/published", userfiles.findAllPublished);
   
    // Retrieve a single assignment with id
    router.get("/:id", userfiles.findOne);
  
    // Update a assignment with id
    router.put("/:id", userfiles.update);
  
    // Delete a assignment with id
    router.delete("/:id", userfiles.delete);
  
    // Create a new assignment
    router.delete("/", userfiles.deleteAll);
  
    app.use("/api/userfiles", router);
  };
  