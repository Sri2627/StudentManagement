const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
 

 
 

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.get("/api/students", controller.userBoard);
  app.get("/api/students/:id", controller.findOne);
  app.put("/api/student/:id", controller.update);
  app.put("/api/studentpassword/:id", controller.updatepassword);

  app.get("/api/classroom", [authJwt.verifyToken, authJwt.isModerator], controller.getClassroom);
 
  app.get("/api/class", controller.getStand);
  app.get("/api/admins", controller.getadminusers);


  app.delete("/api/students/:id", controller.delete);
 
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
 
  app.get("/api/teachers/:id",  controller.findteacher );

  app.get("/api/teachers",  controller.moderatorBoard);
  app.get("/api/admin", [authJwt.verifyToken, authJwt.issuperadmin], controller.adminBoard);
  app.delete("/api/teachers/:id", controller.delete);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  


  
};
