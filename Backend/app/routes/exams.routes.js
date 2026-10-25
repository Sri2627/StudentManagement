const { authJwt } = require("../middlewares");
const exams = require("../controllers/exams.controller");


module.exports = app => {
  
    const exams = require("../controllers/exams.controller");
  
    var router = require("express").Router();
  
    // Create a new assignment
    router.post("/", exams.create);
  
    // Retrieve all assignment
    router.get("/", exams.findAll);
    router.get("/se", exams.getsectionexams);
    router.get("/sm", exams.getstudentmessges);
  
    // Retrieve all published assignment
    router.get("/published", exams.findAllPublished);
   
    // Retrieve a single assignment with id
    router.get("/:id", exams.findOne);
  
    // Update a assignment with id
    router.put("/:id", exams.update);
  
    // Delete a assignment with id
    router.delete("/:id", exams.delete);
  
    // Create a new assignment
    router.delete("/", exams.deleteAll);
  
    app.use("/api/exams", router);
  };
  