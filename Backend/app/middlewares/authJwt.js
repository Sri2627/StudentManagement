const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models").user;

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ message: "Authentication is required." });
  }

  jwt.verify(token, config.secret, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err || !decoded || !decoded.id) {
      return res.status(401).send({ message: "Invalid or expired token." });
    }

    User.findById(decoded.id)
      .populate("roles", "name")
      .exec((userError, user) => {
        if (userError) {
          return res.status(500).send({ message: "Unable to verify account." });
        }
        if (!user) {
          return res.status(401).send({ message: "Account no longer exists." });
        }

        req.userId = user.id;
        req.userRoles = (user.roles || []).map(role => role.name);
        return next();
      });
  });
}

function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.userRoles || !allowedRoles.some(role => req.userRoles.includes(role))) {
      return res.status(403).send({ message: "Insufficient permissions." });
    }
    return next();
  };
}

function isAdmin(req, res, next) {
  return requireRoles("admin")(req, res, next);
}

function isModerator(req, res, next) {
  return requireRoles("moderator", "admin")(req, res, next);
}

function isAccounts(req, res, next) {
  return requireRoles("accounts", "admin")(req, res, next);
}

function isInstitution(req, res, next) {
  return requireRoles("institution", "admin")(req, res, next);
}

function authorizeApiRequest(req, res, next) {
  const path = req.originalUrl.split("?")[0].replace(/\/+$/, "") || "/";
  const method = req.method.toUpperCase();
  const roles = req.userRoles || [];
  const isAdmin = roles.includes("admin");
  const isModerator = roles.includes("moderator");
  const isAccounts = roles.includes("accounts");
  const isRead = method === "GET" || method === "HEAD" || method === "OPTIONS";

  if (path === "/api/companies/init") {
    return isAdmin
      ? next()
      : res.status(403).send({ message: "Insufficient permissions." });
  }

  if (path.startsWith("/api/accounts")) {
    if (!isRead) {
      return isAdmin || isAccounts
        ? next()
        : res.status(403).send({ message: "Insufficient permissions." });
    }

    if (path === "/api/accounts/sm") {
      return isAdmin || isAccounts || roles.includes("user")
        ? next()
        : res.status(403).send({ message: "Insufficient permissions." });
    }

    if (path === "/api/accounts/published") {
      return isAdmin || isAccounts
        ? next()
        : res.status(403).send({ message: "Insufficient permissions." });
    }

    const invoiceIdMatch = path.match(/^\/api\/accounts\/([^/]+)$/);
    if (invoiceIdMatch && !isAdmin && !isAccounts) {
      return requireOwnInvoice(req, res, next, invoiceIdMatch[1]);
    }

    return isAdmin || isAccounts
      ? next()
      : res.status(403).send({ message: "Insufficient permissions." });
  }

  if (path.startsWith("/api/class")) {
    return isRead && (isAdmin || isModerator || isAccounts)
      ? next()
      : res.status(403).send({ message: "Insufficient permissions." });
  }

  if (path.startsWith("/api/results")) {
    if (isRead) {
      if (isAdmin || isModerator) {
        return next();
      }
      if (path === "/api/results/myresults" ||
          path === "/api/results/sm" ||
          path === "/api/results/mr" ||
          path === "/api/results/student") {
        return roles.includes("user")
          ? next()
          : res.status(403).send({ message: "Insufficient permissions." });
      }
      return res.status(403).send({ message: "Insufficient permissions." });
    }

    return isAdmin || isModerator
      ? next()
      : res.status(403).send({ message: "Insufficient permissions." });
  }

  if (path.startsWith("/api/totalresults")) {
    if (isRead) {
      if (isAdmin || isModerator) {
        return next();
      }
      if (path === "/api/totalresults/sid" && roles.includes("user")) {
        return next();
      }
      return res.status(403).send({ message: "Insufficient permissions." });
    }

    return isAdmin || isModerator
      ? next()
      : res.status(403).send({ message: "Insufficient permissions." });
  }

  if (path.startsWith("/api/students") || path.startsWith("/api/teachers") ||
      path.startsWith("/api/admins")) {
    if (isRead) {
      const userIdMatch = path.match(/^\/api\/(?:students|teachers)\/([^/]+)$/);
      if (userIdMatch && userIdMatch[1] === String(req.userId)) {
        return next();
      }
      return isAdmin || isModerator
        ? next()
        : res.status(403).send({ message: "Insufficient permissions." });
    }

    if (path.startsWith("/api/student/") || path.startsWith("/api/studentpassword/")) {
      const targetId = path.split("/").pop();
      return targetId === String(req.userId) || isAdmin
        ? next()
        : res.status(403).send({ message: "Insufficient permissions." });
    }

    return isAdmin
      ? next()
      : res.status(403).send({ message: "Insufficient permissions." });
  }

  if (isRead) {
    return next();
  }

  if (path.startsWith("/api/payment")) {
    return roles.some(role => ["user", "admin", "accounts"].includes(role))
      ? next()
      : res.status(403).send({ message: "Insufficient permissions." });
  }

  if (path.startsWith("/api/assignments") || path.startsWith("/api/exams") ||
      path.startsWith("/api/results") || path.startsWith("/api/events") ||
      path.startsWith("/api/filebox") || path.startsWith("/api/userfiles") ||
      path.startsWith("/api/totalresults") || path.startsWith("/api/tutorials")) {
    return isAdmin || isModerator
      ? next()
      : res.status(403).send({ message: "Insufficient permissions." });
  }

  return isAdmin
    ? next()
    : res.status(403).send({ message: "Insufficient permissions." });
}

function requireOwnInvoice(req, res, next, invoiceId) {
  const db = require("../models");
  const Invoice = db.invoices;
  if (!db.mongoose.Types.ObjectId.isValid(invoiceId)) {
    return res.status(404).send({ message: "Invoice not found." });
  }
  Invoice.findById(invoiceId)
    .select("studentid")
    .exec((err, invoice) => {
      if (err) {
        return res.status(500).send({ message: "Unable to verify invoice access." });
      }
      if (!invoice || String(invoice.studentid) !== String(req.userId)) {
        return res.status(404).send({ message: "Invoice not found." });
      }
      return next();
    });
}

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  isAccounts,
  isInstitution,
  requireRoles,
  authorizeApiRequest
};
