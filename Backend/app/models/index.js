const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dbConfig = require("../config/db.config.js");


const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.user = require("./user.model");
db.role = require("./role.model");
db.assignments = require("./asmt.model.js")(mongoose);
 
db.tutorials = require("./tutorial.model.js")(mongoose);
db.files = require("./files.model")(mongoose);
 
db.exams = require("./exam.model")(mongoose);
db.examtitles = require("./examtitle.model")(mongoose);

db.results = require("./results.model")(mongoose);
db.userfiles = require("./userfiles.model")(mongoose);
//db.files = require("./files.model.js")(mongoose);
db.events = require("./event.model")(mongoose);
db.sections = require("./section.model")(mongoose);
db.invoices = require("./invoice.model")(mongoose);
db.syllabus = require("./syllabus.model")(mongoose);
db.content = require("./content.model")(mongoose);
db.totalresults = require("./total.model")(mongoose);


db.ROLES = ["user", "admin", "moderator", "accounts", "institution"];

module.exports = db;

 