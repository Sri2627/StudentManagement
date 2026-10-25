module.exports = mongoose => {
    var eventschema = mongoose.Schema(
      {
        title: String,
        description: String,
        date: String,
        studentid: String,
        customerid: String,
        published: Boolean,
      },
      { timestamps: true }
    );
  
    eventschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const EVENT = mongoose.model("events", eventschema);
    return EVENT;
  };
   