const { authJwt } = require("../middlewares");
const controller = require("../controllers/filebox.controller");


module.exports = app => {
  
    const accounts = require("../controllers/accounts.controller");
  
    var router = require("express").Router();
  
    // Create a new assignment
    router.post("/", accounts.create);
  
    // Retrieve all assignment
    router.get("/", accounts.findAll);

    router.get("/sm", accounts.getstudentinvoices);
 

  
    // Retrieve all published assignment
    router.get("/published", accounts.findAllPublished);
   
    // Retrieve a single assignment with id
    router.get("/:id", accounts.findOne);
  
    // Update a assignment with id
    router.put("/:id", accounts.update);
  
    // Delete a assignment with id
    router.delete("/:id", accounts.delete);
  
    // Create a new assignment
    router.delete("/", accounts.deleteAll);
  
    app.use("/api/accounts", router);
  };
