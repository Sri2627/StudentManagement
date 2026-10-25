
const Company = require('../models/company.model.js');
const Product = require('../models/product.model.js');

exports.init = (req, res) => {
  var apple = new Company({ 
    name: 'telugu', 
    street: 'Cupertino, CA 95014', 
    phone: '1-408-996-1010' 
  });

  apple.save(function (err) {
    if(err) return console.error(err.stack)
    
    console.log("Apple company is added")
    
    //Apple now exists, so lets create a Product
    var iphone7 = new Product({
      code: "A-123",
      name: "QUATERLY",
      details: "86",
      company: apple._id
    });

    iphone7.save(function (err) {
      if(err) return console.error(err.stack)
      
      console.log("Iphone 7 is added")
    });
    
    var iPadPro = new Product({
      code: "A-456",
      name: "QUATERLY",
      details: "86",
      company: apple._id
    });
    
    iPadPro.save(function(err){
        if(err) return console.error(err.stack)
        
        console.log("IPadPro is added");
    });
    
  });
  
  
  var samsung = new Company({ 
        name: 'English', 
        street: 'Seocho District, Seoul, South Korea', 
        phone: '+82-2-2053-3000'
    });
  
  samsung.save(function(err){
    if(err) return console.error(err.stack)
    
    console.log("Samsung company is added")
    
    // Samsung now exists, so lets create a Product
    var galaxyJ7 = new Product({
      code: "S-012",
      name: "QUATERLY",
      details: "76",
      company: samsung._id  
    });
    
    galaxyJ7.save(function(err){
        if(err) return console.error(err.stack)
        console.log("GalaxyJ7 is added")
    });
    
    var galaxyTabA = new Product({
      code: "S-456",
      name: "QUATERLY",
      details: "66",
      company: samsung._id
    });
    
    galaxyTabA.save(function(err){
        if(err) return console.error(err.stack)
        console.log("GalaxyTabA is added")
        
    })
  });
  
  res.send("Done Initial Data!");
}

exports.findAll = (req, res) => {
    Company.find()
    .then(products => {
        res.send(products);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};
