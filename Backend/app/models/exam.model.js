
module.exports = mongoose => {
    var examschema = mongoose.Schema(
      {
        title: String,
        date: String,
        subject: String,
        syllabus: String,
        customerid: String,
        section: String,
        published: Boolean,
        resultset: Boolean,
        results: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RESULTS"
          }
        ],

      },
      { timestamps: true }
    );
  
    examschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const EXAM = mongoose.model("exams", examschema);
    return EXAM;
  };
   

  
 

