
module.exports = function(app) {
    var products = require('../controllers/product.controller');
    
    app.get('/api/products', products.findAll);
            
    // Find a single Product by Name
    app.get('/api/products/:productName', products.findByName);
    
    // Find all Products of a Company
    app.get('/api/products/company/:companyId', products.findByCompanyId);
}