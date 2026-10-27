const db = require("../models");
const users = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");

const editableFields = [
  "email",
  "fullname",
  "admissionno",
  "mobile",
  "address",
  "subject",
  "section",
  "standard",
  "mysections",
  "profile",
  "photourl",
  "signature",
  "code"
];

exports.allAccess = (req, res) => {
  res.status(200).send("Authenticated content.");
};

exports.findOne = (req, res) => findById(req, res);
exports.findteacher = (req, res) => findById(req, res);
exports.getuserdetails = (req, res) => findById(req, res);

function findById(req, res) {
  users.findById(req.params.id)
    .select("-password")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: "Unable to retrieve user." });
      }
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      return res.send(user);
    });
}

async function findUsersByRole(roleName, filter, res) {
  try {
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(404).send({ message: "Role not found." });
    }
    const foundUsers = await users
      .find({ roles: role._id, ...filter })
      .select("-password")
      .exec();
    return res.send(foundUsers);
  } catch (err) {
    return res.status(500).send({ message: "Unable to retrieve users." });
  }
}

exports.userBoard = (req, res) => findUsersByRole("user", {}, res);
exports.adminBoard = (req, res) => findUsersByRole("admin", {}, res);
exports.moderatorBoard = (req, res) => findUsersByRole("moderator", {}, res);

exports.getClassroom = (req, res) =>
  findUsersByRole("user", { section: req.query.section }, res);

exports.getStand = (req, res) =>
  findUsersByRole("user", { standard: req.query.section }, res);

exports.getadminusers = (req, res) =>
  findUsersByRole("admin", { code: req.query.code }, res);

exports.updatepassword = async (req, res) => {
  const { password } = req.body;
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return res.status(400).send({
      message: "Password must be between 8 and 128 characters."
    });
  }

  try {
    const updatedUser = await users.findByIdAndUpdate(
      req.params.id,
      { $set: { password: bcrypt.hashSync(password, 10) } },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }
    return res.send({ message: "Password updated successfully." });
  } catch (err) {
    return res.status(500).send({ message: "Unable to update password." });
  }
};

exports.update = async (req, res) => {
  const updates = editableFields.reduce((fields, name) => {
    if (req.body[name] !== undefined) {
      fields[name] = req.body[name];
    }
    return fields;
  }, {});

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ message: "No editable user fields provided." });
  }

  try {
    const updatedUser = await users.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }
    return res.send({ message: "User updated successfully." });
  } catch (err) {
    return res.status(500).send({ message: "Unable to update user." });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedUser = await users.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found." });
    }
    return res.send({ message: "User deleted successfully." });
  } catch (err) {
    return res.status(500).send({ message: "Unable to delete user." });
  }
};
