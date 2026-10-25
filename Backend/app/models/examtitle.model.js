

module.exports = mongoose => {
    var examstitlechema = mongoose.Schema(
      {
        title: String,
        description: String,
        section: String,
       },
      { timestamps: true }
    );
  
    examstitlechema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const EXAMTITLE= mongoose.model("examtitles", examstitlechema);
    return EXAMTITLE;
  };
   

  
 

