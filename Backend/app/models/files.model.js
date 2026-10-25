module.exports = mongoose => {
    var fileserverschema = mongoose.Schema(
      {
        name: String,
        size: String,
        userid: String,
        parent_id: String,
        fileurl: String,
        foldername: String,
        filetype: String,
        is_folder: Boolean,
      },
      { timestamps: true }
    );
  
    fileserverschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const FILES = mongoose.model("filebox", fileserverschema);
    return FILES;
  };
   

 