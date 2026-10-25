const db = require("../models/index.js");
const SECTION = db.sections;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.section) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
   // Create a Tutorial
  const section = new SECTION({
    
    section: req.body.section,
    standard: req.body.standard,
    classteacherid: req.body.classteacherid,
  });

  // Save Tutorial in the database
  section
    .save(section)
    .then(data => {
      res.send(data);
      console.log(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the section."
      });
    });
};

 

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  //const title = req.query.title ;
  //customerid
  const customerid = req.query.customerid ;
 // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
 //db.collection.find({name:{'$regex' : 'string', '$options' : 'i'}})

  //find( { "customerid": { $eq: customerid } } )
    console.log(customerid);
    SECTION.find( { customerid: { $eq: customerid } } )
    .then(data => {
      res.send(data);
      console.log(data);
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving section."
      });
    });

 

};




exports.getsectionexams = (req, res) => {
    const customerid = req.query.customerid;
    
    console.log(customerid);
  
    SECTION.find( { customerid: { $eq: customerid } } )
  
  
      .then(data => {
        res.send(data);
        console.log(data);
      })
      .catch(err => {
        res.status(500).send({
          
          message:
            err.message || "Some error occurred while retrieving section."
        });
      });
  };
  

exports.getstudentmessges = (req, res) => {
  const customerid = req.query.customerid;
  
  console.log(customerid);

  SECTION.find( { studentid: { $eq: customerid } } )


    .then(data => {
      res.send(data);
      console.log(data);
    })
    .catch(err => {
      res.status(500).send({
        
        message:
          err.message || "Some error occurred while retrieving section."
      });
    });
};



// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  SECTION.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  SECTION.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update section with id=${id}. Maybe section was not found!`
        });
      } else res.send({ message: "section was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating section with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  SECTION.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete section with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "section was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    SECTION.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} section were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all section."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
    SECTION.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sections."
      });
    });
};
