const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

function publicSignupRoles() {
  return ["user"];
}

const userFields = [
  "username",
  "email",
  "fullname",
  "admissionno",
  "mobile",
  "address",
  "section",
  "standard",
  "subject",
  "mysections",
  "profile",
  "photourl",
  "signature",
  "code"
];

function getUserData(body) {
  return userFields.reduce((user, field) => {
    if (body[field] !== undefined) {
      user[field] = body[field];
    }
    return user;
  }, {});
}

async function createUser(req, res, roleNames) {
  try {
    const roles = await Role.find({ name: { $in: roleNames } });
    if (roles.length !== roleNames.length) {
      return res.status(400).send({ message: "One or more roles are invalid." });
    }

    const userData = getUserData(req.body);
    userData.password = bcrypt.hashSync(req.body.password, 10);
    userData.roles = roles.map(role => role._id);

    await User.create(userData);
    return res.status(201).send({ message: "User was registered successfully!" });
  } catch (err) {
    console.error("User registration failed:", err);
    return res.status(500).send({ message: "Unable to register user." });
  }
}

exports.signup = (req, res) => createUser(req, res, publicSignupRoles());

exports.provision = (req, res) => createUser(req, res, req.body.roles);

exports.signin = (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).send({ message: "Username and password are required." });
  }

  User.findOne({ username: username.trim() })
    .select("+password")
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: "Unable to sign in." });
      }
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid username or password."
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        expiresIn: 86400
      });
      const authorities = (user.roles || []).map(
        role => "ROLE_" + role.name.toUpperCase()
      );

      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.publicSignupRoles = publicSignupRoles;
