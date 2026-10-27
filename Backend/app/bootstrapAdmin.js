const bcrypt = require("bcryptjs");

async function bootstrapAdmin({ User, Role, username, password, email }) {
  const configuredUsername = typeof username === "string" ? username.trim() : "";
  const configuredPassword = typeof password === "string" ? password : "";

  if (!configuredUsername && !configuredPassword) {
    return false;
  }
  if (!configuredUsername || !configuredPassword) {
    throw new Error(
      "Set both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD, or leave both unset."
    );
  }
  if (configuredUsername.length > 50) {
    throw new Error("BOOTSTRAP_ADMIN_USERNAME must be 50 characters or fewer.");
  }
  if (Buffer.byteLength(configuredPassword, "utf8") < 16 ||
      Buffer.byteLength(configuredPassword, "utf8") > 72) {
    throw new Error(
      "BOOTSTRAP_ADMIN_PASSWORD must be between 16 and 72 UTF-8 bytes."
    );
  }

  const existingUser = await User.findOne({ username: configuredUsername })
    .populate("roles", "name")
    .exec();
  if (existingUser) {
    if ((existingUser.roles || []).some(role => role.name === "admin")) {
      return false;
    }
    throw new Error(
      "Bootstrap username already belongs to a non-admin account. " +
      "Choose a different BOOTSTRAP_ADMIN_USERNAME."
    );
  }

  const adminRole = await Role.findOne({ name: "admin" }).exec();
  if (!adminRole) {
    throw new Error("Cannot bootstrap admin: the admin role has not been seeded.");
  }

  const admin = {
    username: configuredUsername,
    password: bcrypt.hashSync(configuredPassword, 10),
    roles: [adminRole._id]
  };
  if (typeof email === "string" && email.trim()) {
    admin.email = email.trim().toLowerCase();
  }

  await User.create(admin);
  return true;
}

module.exports = bootstrapAdmin;
