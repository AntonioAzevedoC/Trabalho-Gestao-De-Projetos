// Middleware file to verify user roles

// When calling the function, the allowed roles parameter is filled with an array containing a list of the codes that are allowed to use that specific function/CRUD call
const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) return res.sendStatus(401); // Unauthorized

    const allowedRolesArray = allowedRoles;

    // Checking if the logged in user role is in the list of roles that can use the specific funcionality/CRUD call
    const result = allowedRolesArray.includes(req.role); // Boolean

    // If the role can't access the functionality, return unauthorized
    if (!result) return res.sendStatus(401); // Unauthorized

    // If everything is cool, then call the functionality
    next();
  };
};

module.exports = verifyRoles;
