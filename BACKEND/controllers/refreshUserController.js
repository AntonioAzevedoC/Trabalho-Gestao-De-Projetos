// File for refreshing user data upon page reload

const fsPromises = require("fs").promises;
const path = require("path");

// Function to handle refreshing user context (React auth)
const handleRefreshUser = async (req, res) => {
  // Defining user data
  // Check verifyJWT.js to understand how the program gets this data
  const userData = { userId: req.id, username: req.name, role: req.id_role };

  // Sending user data
  res.json(userData);
};

module.exports = { handleRefreshUser };
