module.exports = function(app) {

    var companies = require('../controllers/company.controller')
    
    app.get('/api/companies/init', companies.init);
    app.get('/api/companies', companies.findAll);
}