module.exports = {
  url: process.env.MONGODB_URI,
  database: process.env.MONGODB_DATABASE || "students",
  imgBucket: process.env.MONGODB_IMAGE_BUCKET || "photos"
};
