module.exports = mongoose => {
    var syllabusschema = mongoose.Schema(
      {
        subject: String,
        description: String,
        standard: String,
        section: String,
        chapterno: String,
        chaptertitle: String,
        attachmenturl: String,
        videourl: String,
        filetype: String,
        
       },
      { timestamps: true }
    );
  
    syllabusschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const SYLLABUS = mongoose.model("syllabus", syllabusschema);
    return SYLLABUS;
  };
   