const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    (req, res, next) => {
      if (req.headers["x-access-token"]) {
        return res.status(403).send({
          message: "Authenticated account creation is reserved for administrators."
        });
      }
      return next();
    },
    [
      verifySignUp.validateCredentials,
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post(
    "/api/auth/provision",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.validateCredentials,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.provision
  );
};
