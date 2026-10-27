const mongoose = require("mongoose");

const User = mongoose.model(
  "Suser",
  new mongoose.Schema({
    username: String,
    password: { type: String, select: false },
    admissionno:String,
    fullname: String,
    email: String,
    mobile: String,
    address: String,
    subject: String,
    section: String,
    standard: String,
    mysections: [
      {
        type: String,
      
      }
    ],

    profile: String,
    photourl: String,
    signature: String,
    code: String,


    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
