const db = require("../models/index.js");
const RESULT = db.results;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.examid) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
   // Create a Tutorial
  const result = new RESULT({
    examid: req.body.examid,
    examtitle: req.body.examtitle,
    subject: req.body.subject,
    section: req.body.section,
    studentid: req.body.studentid,
    studentname: req.body.studentname,
    totalmarks: req.body.totalmarks,
    marksobtained: req.body.marksobtained,
    attachmenturl: req.body.attachmenturl,
    is_attended: req.body.is_attended,
    ispassed:req.body.ispassed,
    totalattended: req.body.totalattended,
    rank: req.body.rank,
    
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

 

exports.getmyresults = (req, res) => {
  const customerid = req.query.customerid;
   

  RESULT.find( { customerid: { $eq: customerid } } )


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

exports.getstudentresults = (req, res) => {
  const studentid = req.query.studentid;
  const title = req.query.title;


  RESULT.find( { studentid: { $eq: studentid }, examtitle: { $eq: title } } )


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

exports.getresultsbystudentid= (req, res) => {
  const studentid = req.query.studentid;
 


  RESULT.find( { studentid: { $eq: studentid }} )


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



// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  //const title = req.query.title ;
  //customerid
  const examid = req.query.examid ;
 // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
 //db.collection.find({name:{'$regex' : 'string', '$options' : 'i'}})

  //find( { "customerid": { $eq: customerid } } )
    console.log(examid);
    RESULT.find( { examid: { $eq: examid } } )
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
  
    RESULT.find( { customerid: { $eq: customerid } } )
  
  
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
   
    const examid = req.query.examid;
    console.log(examid);
  
    RESULT.find( { examid: { $eq: examid } } )
  
  
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
  const examid = req.query.examid;
  const studentid = req.query.studentid;
  console.log(examid);
  console.log(studentid);
  RESULT.findOne( { examid: { $eq: examid } , studentid: { $eq: studentid }} )

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

  RESULT.findById(id)
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

  RESULT.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

  RESULT.findByIdAndRemove(id, { useFindAndModify: false })
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
    RESULT.deleteMany({})
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
    RESULT.find({ published: true })
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
