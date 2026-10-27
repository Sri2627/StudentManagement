const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

function validateCredentials(req, res, next) {
  const { username, password, email } = req.body;
  if (
    typeof username !== "string" ||
    !username.trim() ||
    username.trim().length > 50 ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128 ||
    (email !== undefined && (typeof email !== "string" || email.length > 254))
  ) {
    return res.status(400).send({
      message: "Provide a username and a password between 8 and 128 characters."
    });
  }
  req.body.username = username.trim();
  if (typeof email === "string") {
    req.body.email = email.trim().toLowerCase();
  }
  return next();
}

function checkDuplicateUsernameOrEmail(req, res, next) {
  User.findOne({ username: req.body.username }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: "Unable to validate account." });
    }
    if (user) {
      return res.status(400).send({ message: "Username is already in use." });
    }
    if (!req.body.email) {
      return next();
    }

    User.findOne({ email: req.body.email }).exec((emailErr, emailUser) => {
      if (emailErr) {
        return res.status(500).send({ message: "Unable to validate account." });
      }
      if (emailUser) {
        return res.status(400).send({ message: "Email is already in use." });
      }
      return next();
    });
  });
}

function checkRolesExisted(req, res, next) {
  const roles = req.body.roles;
  if (
    !Array.isArray(roles) ||
    roles.length === 0 ||
    roles.some(role => typeof role !== "string" || !ROLES.includes(role))
  ) {
    return res.status(400).send({ message: "Provide one or more valid roles." });
  }
  return next();
}

module.exports = {
  validateCredentials,
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};
