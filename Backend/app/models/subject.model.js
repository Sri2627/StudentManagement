
module.exports = mongoose => {
    var subjectschema = mongoose.Schema(
      {
        Subject: String,
        hodid: String,

     
      },
      { timestamps: true }
    );
  
    subjectschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const SUBJECT = mongoose.model("subjects", subjectschema);
    return SUBJECT;
  };
   

  