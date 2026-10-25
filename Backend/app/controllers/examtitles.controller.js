const db = require("../models/index.js");
const EXAM = db.examtitles;
 
// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
   // Create a Tutorial
  const exam = new EXAM({
    title: req.body.title,
    description:  req.body.description,
    section:  req.body.section,
  
  });

  // Save Tutorial in the database
  exam
    .save(exam)
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

 

// Retrieve all Examtitle from the database.
exports.findAll = (req, res) => {
  //const title = req.query.title ;
  //customerid
  const customerid = req.query.customerid ;
 // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
 //db.collection.find({name:{'$regex' : 'string', '$options' : 'i'}})

  //find( { "customerid": { $eq: customerid } } )
    console.log(customerid);
    EXAM.find( { customerid: { $eq: customerid } } )
    .populate('RESULTS')
    .then(data => {
      res.send(data);
      console.log(data);
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Examtitle."
      });
    });

 
  

};

 

exports.getsectionexams = (req, res) => {
    const customerid = req.query.customerid;
    const section = req.query.section;
    console.log(customerid);
  
    EXAM.find( { section: { $eq: section }, customerid: { $eq: customerid } } )
    
      .then(data => {
        res.send(data);
        console.log(data);
      })
      .catch(err => {
        res.status(500).send({
          
          message:
            err.message || "Some error occurred while retrieving Examtitle."
        });
      });

  
  };
  

exports.getstudentmessges = (req, res) => {
  const section = req.query.section;
  
  console.log(section);

  EXAM.find( { section: { $eq: section } } )


 

    .then(data => {
      res.send(data);
      console.log(data);
    })
    .catch(err => {
      res.status(500).send({
        
        message:
          err.message || "Some error occurred while retrieving Examtitle."
      });
    });
};



// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  EXAM.findById(id)
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

  EXAM.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

  EXAM.findByIdAndRemove(id, { useFindAndModify: false })
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

// Delete all Examtitle from the database.
exports.deleteAll = (req, res) => {
    EXAM.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Examtitle were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Examtitle."
      });
    });
};

// Find all published Examtitle
exports.findAllPublished = (req, res) => {

 
    const section = req.query.section;
    const title = req.query.title;
 
  
    EXAM.find( { section: { $eq: section }, title: { $eq: title }} )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Examtitle."
      });
    });
};


 