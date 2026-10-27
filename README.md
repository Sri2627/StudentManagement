# Student Management

Student Management is a web application for managing students, teachers, classes, assignments, exams, results, fees, and learning materials. It includes role-specific interfaces for students, teachers, administrators, accounts staff, and institutions.

## Technology

- **Frontend:** Angular 13
- **Backend:** Node.js and Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcrypt
- **Payments:** Razorpay integration
- **Media:** A separate file-server component for uploaded files

## Repository structure

- `Frontend/` — Angular application and role-specific dashboards.
- `Backend/` — Express API, MongoDB models, controllers, and routes.
- `Backend/app/fileserver/` — Separate file-server application.

## Running locally

### Backend API

```powershell
cd Backend
npm install
node server.js
```

The API defaults to port `8080`. Before starting it, copy `Backend/.env.example`
to `Backend/.env` and configure `MONGODB_URI`, `JWT_SECRET` (at least 32
characters), `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and the trusted
`CORS_ORIGINS`. Do not commit `.env` files or production secrets.

Public registration creates student accounts only. Creating accounts with
other roles is an administrator-only operation. The file server also needs the
MongoDB and JWT environment variables.

### Frontend

```powershell
cd Frontend
npm install
npm start
```

The frontend's API URLs and the backend's CORS origin must be configured to match the local development environment.

## Tests

Run the frontend build and test suite from `Frontend/` with:

```powershell
npm run build
npm test
```

Run the backend regression tests from `Backend/` with:

```powershell
npm test
```

## Security notes

The API requires JWT authentication for protected routes and applies role
authorization on the server. Student signup cannot select a privileged role;
account provisioning and broad student/result access are restricted. Password
hashes are excluded from ordinary user queries, profile updates use an
allowlist, and payment orders are based on stored invoice totals and verified
server-side before invoices are marked paid.

Frontend route guards are a usability feature, not a security boundary. Review
and test API permissions whenever routes or data workflows change. Rotate any
credentials that have been committed or otherwise exposed, and do not treat
this application as production-ready without a deployment-specific security
review.

## Screenshots

Admin, teacher, and student interface screenshots are included in the project history and original project description.
