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

The API connects to MongoDB and seeds missing application roles before it
starts listening. The file-server uses the same MongoDB and JWT environment
variables; configure them in its process environment as well.
