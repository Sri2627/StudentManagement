require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const mongoUri = dbConfig.url;
if (!mongoUri) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}
const jwtSecret = requiredEnv("JWT_SECRET");
if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}
requiredEnv("RAZORPAY_KEY_ID");
requiredEnv("RAZORPAY_KEY_SECRET");

const db = require("./app/models");
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3200")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to our XRapplication." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/turorial.routes")(app);
require("./app/routes/asmt.routes")(app);
require("./app/routes/files.routes")(app);
require("./app/routes/userfiles.routes")(app);
require("./app/routes/exams.routes")(app);
require("./app/routes/results.routes")(app);
require("./app/routes/invoices.routes")(app);
require("./app/routes/sections.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/syllabus.routes")(app);
require("./app/routes/content.routes")(app);
require("./app/routes/total.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/company.routes")(app);
require("./app/routes/examtitle.routes")(app);
require("./app/routes/razor.routes")(app);

async function seedRoles() {
  await Promise.all(
    db.ROLES.map(name =>
      db.role.updateOne(
        { name },
        { $setOnInsert: { name } },
        { upsert: true }
      )
    )
  );
}

async function startServer() {
  try {
    await db.mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Successfully connected to MongoDB.");

    await seedRoles();

    const port = process.env.PORT || 8080;
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });

    server.on("error", err => {
      console.error("Server startup error:", err);
      process.exitCode = 1;
      db.mongoose.disconnect().catch(disconnectError => {
        console.error("MongoDB cleanup failed:", disconnectError);
      });
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exitCode = 1;
    try {
      await db.mongoose.disconnect();
    } catch (disconnectError) {
      console.error("MongoDB cleanup failed:", disconnectError);
    }
  }
}

startServer();
