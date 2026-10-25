 

module.exports = app => {
  
 
    const stripe = require("stripe")("pk_test_51LYOsRSDQaUfYA3CALTWIZHakGxoGSh0g5qCCU725cSCilkbmvfMZI4FcxHGCMdQ8B6iHoTPSlLFWM6ZcyqosMKU00n4ws2w9h");

    var router = require("express").Router();
  
 
   

    router.post("/payment", async (req, res) => {
        const { product } = req.body;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.name,
                            images: [product.image],
                        },
                        unit_amount: product.amount * 100,
                    },
                    quantity: product.quantity,
                },
            ],
            mode: "payment",
          
        });
    
        res.json({ id: session.id });
    });

    
    app.use("/api/payment", router);
  };
  