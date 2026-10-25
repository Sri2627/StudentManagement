const { authJwt } = require("../middlewares");
const controller = require("../controllers/filebox.controller");


module.exports = app => {
  
    const files = require("../controllers/filebox.controller");
  
    var router = require("express").Router();
  
    // Create a new assignment
    router.post("/", files.create);
  
    // Retrieve all assignment
    router.get("/", files.findAll);

    router.get("/sm", files.getstudentmessges);
    router.get("/children", files.getchildren);

  
    // Retrieve all published assignment
    router.get("/published", files.findAllPublished);
   
    // Retrieve a single assignment with id
    router.get("/:id", files.findOne);
  
    // Update a assignment with id
    router.put("/:id", files.update);
  
    // Delete a assignment with id
    router.delete("/:id", files.delete);
  
    // Create a new assignment
    router.delete("/", files.deleteAll);
  
    app.use("/api/filebox", router);
  };
