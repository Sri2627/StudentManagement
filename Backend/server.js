const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const bootstrapAdmin = require("./app/bootstrapAdmin");

const app = express();

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    if (name === "MONGODB_URI") {
      throw new Error(
        "Missing MONGODB_URI. Copy Backend/.env.example to Backend/.env, " +
        "replace the MongoDB URI with your private connection string, and restart."
      );
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const mongoUri = requiredEnv("MONGODB_URI");
const jwtSecret = requiredEnv("JWT_SECRET");
if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}
requiredEnv("RAZORPAY_KEY_ID");
requiredEnv("RAZORPAY_KEY_SECRET");

const db = require("./app/models");
const allowedOrigins = (process.env.CORS_ORIGINS ||
  "http://localhost:4200,http://localhost:3200")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Edu Whale." });
});

require("./app/routes/auth.routes")(app);
const authJwt = require("./app/middlewares/authJwt");
app.use("/api", authJwt.verifyToken, authJwt.authorizeApiRequest);
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

    const adminCreated = await bootstrapAdmin({
      User: db.user,
      Role: db.role,
      username: process.env.BOOTSTRAP_ADMIN_USERNAME,
      password: process.env.BOOTSTRAP_ADMIN_PASSWORD,
      email: process.env.BOOTSTRAP_ADMIN_EMAIL
    });
    if (adminCreated) {
      console.log("Bootstrap administrator account created.");
    }

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
