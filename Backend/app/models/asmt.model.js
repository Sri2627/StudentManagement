module.exports = mongoose => {
    var asmtschema = mongoose.Schema(
      {
        title: String,
        description: String,
        studentid: String,
        customerid: String,
        attachedurl: String,
        published: Boolean,
      },
      { timestamps: true }
    );
  
    asmtschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const ASMT = mongoose.model("assignments", asmtschema);
    return ASMT;
  };
   

  
 