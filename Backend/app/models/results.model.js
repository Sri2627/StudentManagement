module.exports = mongoose => {
    var resultsschema = mongoose.Schema(
      {
        examid: String,
        examtitle: String,
        subject: String,
        section: String,
        studentid: String,
        studentname: String,
        totalmarks: String,
        marksobtained: String,
        attachmenturl: String,
        is_attended: Boolean,
        totalattended: String,
        rank: String,
        ispassed:Boolean,
    },
      { timestamps: true }
    );
  
    resultsschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const RESULTS = mongoose.model("results", resultsschema);
    return RESULTS;
  };
   

 