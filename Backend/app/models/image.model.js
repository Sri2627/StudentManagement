module.exports = mongoose => {
    var fileschema = mongoose.Schema(
      {
        filename: String,
        studentid: String,
        fileurl: String,
        uploaded: Boolean,
      },
      { timestamps: true }
    );
  
    fileschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Files = mongoose.model("files", fileschema);
    return Files;
  };
   

  
 

 

