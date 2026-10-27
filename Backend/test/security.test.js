const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");

const authJwt = require("../app/middlewares/authJwt");
const authController = require("../app/controllers/auth.controller");
const bootstrapAdmin = require("../app/bootstrapAdmin");
const resultsController = require("../app/controllers/results.controller");
const userController = require("../app/controllers/user.controller");
const db = require("../app/models");
const originalLoad = Module._load;

function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    }
  };
}

function runMiddleware(middleware, req) {
  const res = response();
  let calledNext = false;
  middleware(req, res, () => {
    calledNext = true;
  });
  return { res, calledNext };
}

test("admin bootstrap creates a hashed admin account when the username is unused", async () => {
  let createdAdmin;
  const created = await bootstrapAdmin({
    User: {
      findOne: () => ({
        populate: () => ({ exec: async () => null })
      }),
      create: async admin => {
        createdAdmin = admin;
      }
    },
    Role: {
      findOne: () => ({ exec: async () => ({ _id: "admin-role" }) })
    },
    username: "first-admin",
    password: "a-strong-random-password",
    email: "ADMIN@example.com"
  });

  assert.equal(created, true);
  assert.equal(createdAdmin.username, "first-admin");
  assert.notEqual(createdAdmin.password, "a-strong-random-password");
  assert.deepEqual(createdAdmin.roles, ["admin-role"]);
  assert.equal(createdAdmin.email, "admin@example.com");
});

test("admin bootstrap is idempotent and never promotes an existing user", async () => {
  const existingAdmin = await bootstrapAdmin({
    User: {
      findOne: () => ({
        populate: () => ({
          exec: async () => ({ roles: [{ name: "admin" }] })
        })
      }),
      create: async () => {
        assert.fail("Existing administrator should not be recreated.");
      }
    },
    Role: {},
    username: "existing-admin",
    password: "a-strong-random-password"
  });
  assert.equal(existingAdmin, false);

  await assert.rejects(
    bootstrapAdmin({
      User: {
        findOne: () => ({
          populate: () => ({
            exec: async () => ({ roles: [{ name: "user" }] })
          })
        })
      },
      Role: {},
      username: "existing-student",
      password: "a-strong-random-password"
    }),
    /already belongs to a non-admin account/
  );
});

test("admin bootstrap rejects partial or weak credentials", async () => {
  const models = { User: {}, Role: {} };
  assert.equal(await bootstrapAdmin({
    ...models,
    username: "",
    password: ""
  }), false);
  await assert.rejects(
    bootstrapAdmin({ ...models, username: "first-admin", password: "" }),
    /Set both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD/
  );
  await assert.rejects(
    bootstrapAdmin({
      ...models,
      username: "first-admin",
      password: "short"
    }),
    /between 16 and 72 UTF-8 bytes/
  );
});

test("public registration always assigns the student role", async () => {
  const originalFind = db.role.find;
  const originalCreate = db.user.create;
  let savedUser;
  db.role.find = async query => {
    assert.deepEqual(query.name.$in, ["user"]);
    return [{ _id: "student-role" }];
  };
  db.user.create = async data => {
    savedUser = data;
  };

  try {
    const res = response();
    await authController.signup({
      body: {
        username: "new-student",
        password: "strong-password",
        roles: ["admin"]
      }
    }, res);
    assert.equal(res.statusCode, 201);
    assert.deepEqual(savedUser.roles, ["student-role"]);
    assert.notEqual(savedUser.password, "strong-password");
  } finally {
    db.role.find = originalFind;
    db.user.create = originalCreate;
  }
});

test("protected API requests reject callers without a token", () => {
  const { res, calledNext } = runMiddleware(authJwt.verifyToken, {
    headers: {}
  });
  assert.equal(res.statusCode, 401);
  assert.equal(calledNext, false);
});

test("write authorization denies students and permits teacher classroom writes", () => {
  const studentAttempt = runMiddleware(authJwt.authorizeApiRequest, {
    originalUrl: "/api/sections",
    method: "POST",
    userId: "student-id",
    userRoles: ["user"]
  });
  assert.equal(studentAttempt.res.statusCode, 403);
  assert.equal(studentAttempt.calledNext, false);

  const teacherAttempt = runMiddleware(authJwt.authorizeApiRequest, {
    originalUrl: "/api/assignments",
    method: "POST",
    userId: "teacher-id",
    userRoles: ["moderator"]
  });
  assert.equal(teacherAttempt.calledNext, true);
});

test("invoice reads are limited to the owning student or accounts roles", () => {
  const studentAttempt = runMiddleware(authJwt.authorizeApiRequest, {
    originalUrl: "/api/accounts",
    method: "GET",
    userRoles: ["user"]
  });
  assert.equal(studentAttempt.res.statusCode, 403);

  const accountsAttempt = runMiddleware(authJwt.authorizeApiRequest, {
    originalUrl: "/api/accounts",
    method: "GET",
    userRoles: ["accounts"]
  });
  assert.equal(accountsAttempt.calledNext, true);
});

test("students can read only their own-result endpoints", () => {
  const ownResults = runMiddleware(authJwt.authorizeApiRequest, {
    originalUrl: "/api/results/myresults?customerid=another-student",
    method: "GET",
    userId: "student-id",
    userRoles: ["user"]
  });
  assert.equal(ownResults.calledNext, true);

  const allResults = runMiddleware(authJwt.authorizeApiRequest, {
    originalUrl: "/api/results?examid=exam-id",
    method: "GET",
    userId: "student-id",
    userRoles: ["user"]
  });
  assert.equal(allResults.res.statusCode, 403);
  assert.equal(allResults.calledNext, false);
});

test("students cannot list aggregate results or query another student's totals", () => {
  const studentList = runMiddleware(authJwt.authorizeApiRequest, {
    originalUrl: "/api/totalresults",
    method: "GET",
    userId: "student-id",
    userRoles: ["user"]
  });
  assert.equal(studentList.res.statusCode, 403);

  const studentTotals = runMiddleware(authJwt.authorizeApiRequest, {
    originalUrl: "/api/totalresults/sid?title=another-student",
    method: "GET",
    userId: "student-id",
    userRoles: ["user"]
  });
  assert.equal(studentTotals.calledNext, true);
});

test("student result queries ignore client-supplied student IDs", async () => {
  const originalFind = db.results.find;
  let query;
  db.results.find = value => {
    query = value;
    return Promise.resolve([]);
  };

  try {
    const res = response();
    await resultsController.getmyresults({
      userId: "student-id",
      userRoles: ["user"],
      query: { customerid: "another-student" }
    }, res);
    assert.deepEqual(query, { customerid: { $eq: "student-id" } });
  } finally {
    db.results.find = originalFind;
  }
});

test("user profile updates ignore password and role fields", async () => {
  const originalUpdate = db.user.findByIdAndUpdate;
  let update;
  db.user.findByIdAndUpdate = (id, fields) => {
    update = { id, fields };
    return { select: () => Promise.resolve({ _id: id }) };
  };

  try {
    const res = response();
    await userController.update({
      params: { id: "student-id" },
      body: {
        fullname: "Updated Student",
        password: "attacker-controlled",
        roles: ["admin"]
      }
    }, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(update.fields, { $set: { fullname: "Updated Student" } });
  } finally {
    db.user.findByIdAndUpdate = originalUpdate;
  }
});

test("payment order uses the invoice amount and verifies a captured payment", async () => {
  const routePath = path.resolve(__dirname, "../app/routes/razor.routes.js");
  const invoice = {
    _id: "invoice-id",
    studentid: "student-id",
    total: "12.34",
    ispaid: false,
    paymentOrderId: undefined,
    async save() {}
  };
  let createdOrder;
  let savedPayment;
  const handlers = {};
  const fakeRouter = {
    post(route, handler) {
      handlers[route] = handler;
    }
  };
  const FakeInvoice = {
    async findOne(query) {
      return query.studentid === invoice.studentid &&
        query._id === invoice._id &&
        (!query.paymentOrderId || query.paymentOrderId === invoice.paymentOrderId)
        ? invoice
        : null;
    },
    async findOneAndUpdate(query, update) {
      savedPayment = { query, update };
      return { ...invoice, ...update.$set };
    }
  };
  class FakeRazorpay {
    constructor() {
      this.orders = {
        create: async order => {
          createdOrder = order;
          return { id: "order-id", amount: order.amount };
        }
      };
      this.payments = {
        fetch: async () => ({
          order_id: "order-id",
          amount: 1234,
          currency: "INR",
          status: "captured"
        })
      };
    }
  }

  process.env.RAZORPAY_KEY_ID = "test-key";
  process.env.RAZORPAY_KEY_SECRET = "test-secret";
  delete require.cache[routePath];
  Module._load = function(request, parent, isMain) {
    if (parent.filename === routePath && request === "razorpay") {
      return FakeRazorpay;
    }
    if (parent.filename === routePath && request === "../models") {
      return { invoices: FakeInvoice };
    }
    if (parent.filename === routePath && request === "express") {
      return { Router: () => fakeRouter };
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    const paymentRoutes = require(routePath);
    paymentRoutes({ use: (prefix, router) => assert.equal(prefix, "/api/payment") });

    const orderRes = response();
    await handlers["/"]({
      userId: "student-id",
      body: { receipt: "invoice-id", amount: 1 }
    }, orderRes);
    assert.equal(orderRes.statusCode, 200);
    assert.equal(createdOrder.amount, 1234);
    assert.equal(createdOrder.receipt, "invoice-id");

    const paymentId = "payment-id";
    const signature = crypto
      .createHmac("sha256", "test-secret")
      .update(`order-id|${paymentId}`)
      .digest("hex");
    const verifyRes = response();
    await handlers["/verify"]({
      userId: "student-id",
      body: {
        invoiceId: "invoice-id",
        razorpay_order_id: "order-id",
        razorpay_payment_id: paymentId,
        razorpay_signature: signature
      }
    }, verifyRes);
    assert.equal(verifyRes.statusCode, 200);
    assert.equal(savedPayment.update.$set.ispaid, true);
    assert.equal(savedPayment.update.$set.paymentid, paymentId);
  } finally {
    Module._load = originalLoad;
    delete require.cache[routePath];
  }
});
