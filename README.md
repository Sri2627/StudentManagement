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

The API defaults to port `8080`. Configure valid MongoDB connection details and payment credentials before starting the server. Do not commit credentials or production secrets to source control.

### Frontend

```powershell
cd Frontend
npm install
npm start
```

The frontend's API URLs and the backend's CORS origin must be configured to match the local development environment.

## Tests

Run the Angular test suite from `Frontend/` with:

```powershell
npm test
```

The backend currently has no test suite configured; its `npm test` script is a placeholder.

## Security notes

The current implementation needs security work before it is suitable for production:

- Public signup accepts requested roles. It must not allow users to assign themselves administrator or other privileged roles.
- Several user listing, retrieval, update, password-change, and delete endpoints do not enforce authentication and authorization on the server.
- Payment order creation accepts a client-supplied amount. The server must validate prices and payment results before considering an order paid.
- JWT and payment credentials must be supplied through protected environment configuration. Rotate any credentials that have been committed or otherwise exposed.
- User API responses should not expose password hashes, and update endpoints should allow only explicitly approved fields.
- Some role-based queries depend on hard-coded database role IDs; use role names or another stable mechanism instead.

Frontend route guards are not a substitute for backend authorization. Apply and verify access controls on every protected API endpoint.

## Screenshots

Admin, teacher, and student interface screenshots are included in the project history and original project description.
