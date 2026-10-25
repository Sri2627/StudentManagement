module.exports = mongoose => {
    var contentschema = mongoose.Schema(
      {
        subject: String,
        description: String,
       },
      { timestamps: true }
    );
  
    contentschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const CONTENT = mongoose.model("content", contentschema);
    return CONTENT;
  };
   