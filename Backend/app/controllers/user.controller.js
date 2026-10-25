 
const { request } = require('express');
let users = require('../models/user.model')
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

  
exports.findOne = (req, res) => {
  const id = req.params.id;

  users.findById(id)
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


exports.userBoard = (req, res) => {
 // res.status(200).send("User Content.");

 users.find({roles: "62c2c9e84c10654b1c16a54a" }, function (err, data) {
  if (err){
      console.log(err)
  }
  else{
    res.json(data)
  }
});



};

exports.adminBoard = (req, res) => {
  // res.status(200).send("Admin Content.");
 
  users.find({roles: "62c2c9e84c10654b1c16a54c" }, function (err, data) {
   if (err){
       console.log(err)
   }
   else{
     res.json(data)
   }
 });
 
 };

exports.moderatorBoard = (req, res) => {
  // res.status(200).send("Moderator Content.");
 
  users.find({roles: "62c2c9e84c10654b1c16a54b" }, function (err, data) {
   if (err){
       console.log(err)
   }
   else{
     res.json(data)
   }
 });


};
exports.getClassroom = (req, res) => {
  // res.status(200).send("User Content.");
  const sec = req.params.section;
    


  // users.find({roles: "62c2c9e84c10654b1c16a54a" ,  "standard": { $eq: sec }},function (err, data) {
  //   if (err){
  //       console.log(err)
  //   }
  //   else{
  //     res.json(data)
  //     console.log(sec)

      
  //   }
  // });



  const section = req.query.section ;
  

  users.find( { roles: "62c2c9e84c10654b1c16a54a" , section: { $eq: section } } )
    .then(data => {
      res.send(data);
 
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });






}


exports.findteacher = (req, res) => {
  const id = req.params.id;

  users.findById(id)
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





exports.getStand = (req, res) => {
  // res.status(200).send("User Content.");
  const sec = req.params.section;
    
 

  const section = req.query.section ;
  

  users.find( { roles: "62c2c9e84c10654b1c16a54a" , standard: { $eq: section } } )
    .then(data => {
      res.send(data);
 
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });






}

exports.getadminusers = (req, res) => {
 
  const code = req.query.code ;
  
  users.find( { roles: "62c2c9e84c10654b1c16a54c" , code: { $eq: code } } )
    .then(data => {
      res.send(data);
 
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
 

}







exports.getuserdetails = (req, res) => {
  // res.status(200).send("Moderator Content.");
  const id = req.params.id;
    
           users.findById(id)
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
 
 



// exports.deleteStudent = (req, res) => {
//   //res.status(200).send("Moderator Content.");

 
//    users.findByIdAndDelete(req.userId, function (err, data) {

//     id: req.body.id;
    
//     if (err){
//         console.log(err)
//     }
//     else{
//         console.log("Deleted : ", data);
//     }
// });



// };

 

exports.updatepassword = (req, res) => {
 
 
  const password = bcrypt.hashSync(req.body.password, 8);
  console.log(password);
  const id = req.params.id;
    req.params.password = password;
 
    const body = {
      id: req.body.id,
       
      password: bcrypt.hashSync(req.body.password, 8)
    };


  users.findByIdAndUpdate(id, body, { useFindAndModify: false })
     .then(data => {
      console.log(data);
      if (!data) {
        res.status(404).send({
          message: `Cannot update user with id=${id}. Maybe user was not found!`
        });
      } else res.send({ message: "user was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating user with id=" + id
      });
    });

}

exports.update = (req, res) => {

  console.log("update started");

  const id = req.params.id;
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
 

  users.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update user with id=${id}. Maybe user was not found!`
        });
      } else res.send({ message: "user was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating user with id=" + id
      });
    });

}

 
exports.delete = (req, res) => {
  const id = req.params.id;
console.log("delete started");
  users.findByIdAndRemove(id, { useFindAndModify: false })
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

