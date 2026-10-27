# Node.js MongoDB – User Authentication & Authorization example with JWT & Mongoose

## User Registration, User Login and Authorization process.
The diagram shows flow of how we implement User Registration, User Login and Authorization process.

 

## Project setup
```
npm install
```

### Run
```
node server.js
```

Before starting the API, copy `.env.example` to `.env` and set real values for
`MONGODB_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET`.
The MongoDB URI should include the database name. Set `CORS_ORIGINS` to a
comma-separated list of trusted frontend origins. Never commit `.env` or share
its credentials.
For the default Angular development server, include
`http://localhost:4200` in `CORS_ORIGINS`. Add other frontend origins as a
comma-separated list, without trailing slashes.

From the `Backend` directory, create the local environment file with
`Copy-Item .env.example .env` in PowerShell. The API loads `Backend/.env`
regardless of the current working directory; the example file contains
placeholders and must be updated with valid values before starting the server.

The API connects to MongoDB and seeds missing application roles before it
starts listening. The file-server uses the same MongoDB and JWT environment
variables; configure them in its process environment as well.

### Create the first administrator

To create the initial system administrator, set `BOOTSTRAP_ADMIN_USERNAME`
and `BOOTSTRAP_ADMIN_PASSWORD` in `Backend/.env` before starting the API.
Use a unique username and a randomly generated password between 16 and 72
UTF-8 bytes. `BOOTSTRAP_ADMIN_EMAIL` is optional. The API creates this admin
only if the username is not already in use. It will not promote a non-admin
account or change an existing admin's password. After the account is created,
remove the bootstrap credentials from `.env` and sign in through the frontend
login page. Never commit or share these values.
