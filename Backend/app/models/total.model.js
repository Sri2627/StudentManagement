module.exports = mongoose => {
    var totalresultsschema = mongoose.Schema(
      {
    
        studentid:String,
        photourl:String,
        studentname:String,
        exam:String,
         s1:Number,
         s2:Number,
         s3:Number,
         s4:Number,
         s5:Number,
         s6:Number,
        section:String,
        totalmarks:String,
        rank:Number,
        totalattended:String,
        total:String,
    },
      { timestamps: true }
    );
  
    totalresultsschema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const TRESULTS = mongoose.model("totalresults", totalresultsschema);
    return TRESULTS;
  };
   

 