// Middleware file to verify user permissions

// When calling the function, pass the name of the permission required to use that route, e.g. verifyRoles("create_employee")
const verifyRoles = (requiredPermission) => {
  return (req, res, next) => {
    if (!Array.isArray(req?.permissions)) return res.sendStatus(401); // Unauthorized

    // Checking if the user's permissions array contains the required permission
    const result = req.permissions.includes(requiredPermission); // Boolean

    // If the user doesn't have the permission, block the request
    if (!result) return res.sendStatus(403); // Forbidden

    next();
  };
};
module.exports = verifyRoles;
