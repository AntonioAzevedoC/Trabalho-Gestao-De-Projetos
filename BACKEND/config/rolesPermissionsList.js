// File containing a list of possible user roles
// This could be a table in a database

// Associate roles id to permissions
// Send permissions id together with role id to acess token
// Change the list bellow to specific permissions
// Roles can be altered in the database, and different permission might be addeded or removed from any role
// Permissions however are fixed

// The assigned numbers are random
const PERMISSIONS_LIST = {
  USER: "Usuários",
  EMPLOYEE: "Funcionários",
  EQUIPMENT: "Equipamentos",
  SHIFTS: "Turnos",
  ROLES: "Papéis",
  DASHBOARD: "Relatórios",
  ATTENDANCE: "Presença",
};

module.exports = PERMISSIONS_LIST;
