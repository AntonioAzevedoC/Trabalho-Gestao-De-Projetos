// Main server file

// Importing packages
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Importing other files functions
const verifyJWT = require("./middleware/verifyJWT");
const corsOptions = require("./config/corsOptions");
const verifyCredentials = require("./middleware/credentials");

// Setting localhost port
const PORT = process.env.PORT || 4500;

// custom middleware logger

// Checking credentials before cors
app.use(verifyCredentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Routes
// Handling new user
app.use("/register", require("./routes/register"));
// Handling authentication
app.use("/auth", require("./routes/auth"));
// Handling refresh token requests
app.use("/refresh", require("./routes/refresh"));
// Handling logout
app.use("/logout", require("./routes/logout"));

// Calling verify JWT (JSON Web Token) on all routes below this point
// app.use(verifyJWT);

// Handling users functions
app.use("/users", require("./routes/api/users"));
app.use("/employees", require("./routes/api/employees"));
app.use("/roles", require("./routes/api/roles"));
app.use("/permissions", require("./routes/api/permissions"));
app.use("/equipments", require("./routes/api/equipment"));
app.use("/dashboard", require("./routes/api/dashboard"));

// Handling user data refresh functions
// app.use("/re", require("./routes/refreshUser"));

// Server Running
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
