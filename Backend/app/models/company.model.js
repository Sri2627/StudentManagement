
const Product = require('../models/product.model.js');
const mongoose = require('mongoose'), Schema = mongoose.Schema;

const CompanySchema = mongoose.Schema({
    name: String,
    street: String,
    phone: String,
    products : [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Company', CompanySchema);
 