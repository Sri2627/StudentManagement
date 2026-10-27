require("dotenv").config({
  path: require("path").resolve(__dirname, "../../../.env")
});

const cors = require("cors");
const express = require("express");
const app = express();
const initRoutes = require("./routes");

const allowedOrigins = (process.env.CORS_ORIGINS ||
  "http://localhost:4200,http://localhost:3200")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = 8090;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
