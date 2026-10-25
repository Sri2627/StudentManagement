
module.exports = mongoose => {
    var invoicechema = mongoose.Schema(
      {
        name: String,
        studentid: String,
        admissionno: String,
        standard: String,
        feeformat:String,
        lastdate: String,
        tutionfee: String,
        transportfee: String,
        termfee: String,
        total: String,
        ispaid: Boolean,
        paymentid: String,
      },
      { timestamps: true }
    );
  
    invoicechema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const INVOICE = mongoose.model("invoice", invoicechema);
    return INVOICE;
  };
   

  
 

