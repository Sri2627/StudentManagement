const db = require("../models/index.js");
const TRESULT = db.totalresults;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.studentid) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
   // Create a Tutorial
  const result = new TRESULT({
   
 
    studentid:req.body.studentid,
    photourl:req.body.photourl,
    studentname:req.body.studentname,
    exam:req.body.exam,
    s1:req.body.s1,
    s2:req.body.s2,
    s3:req.body.s3,
    s4:req.body.s4,
    s5:req.body.s5,
    s6:req.body.s6,
    section:req.body.section,
    totalmarks:req.body.totalmarks,
    rank:req.body.rank,
    totalattended:req.body.totalattended,
    total:req.body.total,
  });

  // Save Tutorial in the database
  result
    .save(result)
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
 
 
 // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
 //db.collection.find({name:{'$regex' : 'string', '$options' : 'i'}})

 
    TRESULT.find(   )
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




exports.getsectionexams = (req, res) => {
    const customerid = req.query.customerid;
    
    console.log(customerid);
  
    TRESULT.find( { customerid: { $eq: customerid } } )
  
  
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
  


  exports.getsectioneresults = (req, res) => {
   
    const examid = req.query.title;
    console.log(examid);
  
    TRESULT.find( { exam: { $eq: examid } } )
  
  
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
  



exports.getstudentresult = (req, res) => {
  const title = req.query.title;
 
 
  TRESULT.find( { exam: { $eq: title } } )
  

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

exports.getstudentresultbyid = (req, res) => {
  const title = req.query.title;
  console.log(title);
  TRESULT.find( { studentid: { $eq: title } } )
  

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
  const studentid = req.params.studentid;

  
  TRESULT.find( { studentid: { $eq: studentid  } } )
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

  TRESULT.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

  TRESULT.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Result was deleted successfully!"
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
    TRESULT.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
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
    TRESULT.find({ published: true })
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
