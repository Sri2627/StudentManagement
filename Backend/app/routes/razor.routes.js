const Razorpay = require('razorpay');

module.exports = app => {
  const router = require("express").Router();
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  router.post("/", async (req, res) => {
    const amount = Number(req.body.amount);
    const amountInPaise = Math.round(amount * 100);

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isSafeInteger(amountInPaise)
    ) {
      return res
        .status(400)
        .send({ message: "A valid positive amount is required." });
    }

    try {
      const order = await instance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: req.body.receipt
      });
      return res.send(order);
    } catch (err) {
      console.error("Payment order creation failed:", err);
      return res
        .status(502)
        .send({ message: "Payment order could not be created." });
    }
  });

  app.use("/api/payment", router);
};