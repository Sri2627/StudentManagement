module.exports = mongoose => {
    var userfilesschema = mongoose.Schema(
      {
        name: String,
        studentid: String,
        customerid: String,
        fileurl: String,
        uploaded: Boolean,
      },
      { timestamps: true }
    );
  
    userfilesschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const USERFILES = mongoose.model("userfiles", userfilesschema);
    return USERFILES;
  };
   

  
 