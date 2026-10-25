const db = require("../models");
const CONTENT = db.content;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.subject) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const event = new CONTENT({
    subject: req.body.subject,
    description: req.body.description,
    
  });

  // Save Tutorial in the database
  event
    .save(event)
    .then(data => {
      res.send(data);
      console.log(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
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
    CONTENT.find( { customerid: { $eq: customerid } } )
    .then(data => {
      res.send(data);
 
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });

 

};


exports.getevent = (req, res) => {
  const date = req.query.date;
  
  console.log(date);

  CONTENT.find( { date: { $eq: date } } )


    .then(data => {
      res.send(data);
      console.log(data);
    })
    .catch(err => {
      res.status(500).send({
        
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};



// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  CONTENT.findById(id)
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

  CONTENT.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  CONTENT.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
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
    CONTENT.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Event were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
    CONTENT.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
