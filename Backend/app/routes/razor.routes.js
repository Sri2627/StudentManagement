const crypto = require("crypto");
const Razorpay = require("razorpay");
const Invoice = require("../models").invoices;

function amountToPaise(value) {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    !/^\d+(?:\.\d{1,2})?$/.test(String(value).trim())
  ) {
    return null;
  }
  const amount = Number(value);
  const paise = Math.round(amount * 100);
  return Number.isSafeInteger(paise) && paise > 0 ? paise : null;
}

function verifySignature(orderId, paymentId, signature, secret) {
  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const actual = Buffer.from(signature, "hex");
  return actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected);
}

module.exports = app => {
  const router = require("express").Router();
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  router.post("/", async (req, res) => {
    const invoiceId = req.body.receipt;
    if (typeof invoiceId !== "string" || !invoiceId) {
      return res.status(400).send({ message: "An invoice ID is required." });
    }

    try {
      const invoice = await Invoice.findOne({
        _id: invoiceId,
        studentid: req.userId
      });
      if (!invoice || invoice.ispaid) {
        return res.status(404).send({ message: "Unpaid invoice not found." });
      }

      const amount = amountToPaise(invoice.total);
      if (amount === null) {
        return res.status(400).send({ message: "Invoice has an invalid amount." });
      }

      const order = await instance.orders.create({
        amount,
        currency: "INR",
        receipt: String(invoice._id)
      });
      invoice.paymentOrderId = order.id;
      await invoice.save();
      return res.send(order);
    } catch (err) {
      console.error("Payment order creation failed:", err);
      return res.status(502).send({ message: "Payment order could not be created." });
    }
  });

  router.post("/verify", async (req, res) => {
    const {
      invoiceId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    } = req.body;

    if (!verifySignature(orderId, paymentId, signature, process.env.RAZORPAY_KEY_SECRET)) {
      return res.status(400).send({ message: "Payment signature is invalid." });
    }

    try {
      const invoice = await Invoice.findOne({
        _id: invoiceId,
        studentid: req.userId,
        paymentOrderId: orderId,
        ispaid: { $ne: true }
      });
      if (!invoice) {
        return res.status(404).send({ message: "Unpaid invoice not found." });
      }

      const payment = await instance.payments.fetch(paymentId);
      const expectedAmount = amountToPaise(invoice.total);
      if (
        payment.order_id !== orderId ||
        payment.status !== "captured" ||
        payment.currency !== "INR" ||
        payment.amount !== expectedAmount
      ) {
        return res.status(400).send({ message: "Payment does not match the invoice." });
      }

      const updatedInvoice = await Invoice.findOneAndUpdate(
        {
          _id: invoice._id,
          studentid: req.userId,
          paymentOrderId: orderId,
          ispaid: { $ne: true }
        },
        {
          $set: { ispaid: true, paymentid: paymentId }
        },
        { new: true }
      );
      if (!updatedInvoice) {
        return res.status(409).send({ message: "Invoice has already been paid." });
      }
      return res.send({ message: "Payment verified.", invoice: updatedInvoice });
    } catch (err) {
      console.error("Payment verification failed:", err);
      return res.status(502).send({ message: "Payment could not be verified." });
    }
  });

  app.use("/api/payment", router);
};

module.exports.amountToPaise = amountToPaise;
module.exports.verifySignature = verifySignature;
