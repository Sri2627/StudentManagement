
module.exports = mongoose => {
    var sectionschema = mongoose.Schema(
      {
        section: String,
        standard: String,
        classteacherid: String,
     
      },
      { timestamps: true }
    );
  
    sectionschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const SECTION = mongoose.model("sections", sectionschema);
    return SECTION;
  };
   

  