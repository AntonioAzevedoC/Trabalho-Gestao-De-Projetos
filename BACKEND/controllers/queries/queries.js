// Queries for Project

export const queries = {
  //
  //
  // SELECTS

  // Query to select all users data
  qSelectAllUsers: `
  SELECT u.id, u.name, u.email, r.name, u.id_role FROM "user" u
	INNER JOIN role r ON u.id_role = r.id
    WHERE u.status_active = true;`,

  // Query to select a specific user by ID
  qSelectUserByID: `SELECT u.name, u.email, u.id_role, r.name FROM "user" u 
		INNER JOIN role r ON u.id_role = r.id 
		WHERE u.id = $1;`,

  // Query to select a specific user by Email
  qSelectUserByEmail: `
  SELECT u.id, u.name, u.id_role, u.password_hash, u.status_active FROM "user" u 
		WHERE u.email = $1;`,

  // Query to select a specific user
  qSelectUserIDByEmail: `SELECT u.id, u.password_hash FROM "user" u 
		WHERE u.email = $1;`,

  // Query to select users by email or name, with Full-Text Search
  qSelectUsersFullTextSearch: `
  SELECT u.id, u.name, u.email, u.id_role, r.name FROM "user" u 
    INNER JOIN role r ON u.id_role = r.id 
    WHERE u.status_active = true AND to_tsvector('portuguese', u.name || ' ' || u.email) @@ plainto_tsquery('portuguese', $1);`,

  // Query to select a user data by the refresh token value
  qSelectRefreshToken: `
  SELECT rt.id_refresh_token, rt.id, rt.vence_em, u.name, u.id_role, u.id FROM refresh_tokens AS rt 
    INNER JOIN "user" AS u 
      ON rt.id = u.id
      WHERE rt.token = $1;`,

  // Query to select all data related to employee
  qSelectEmployeeFullById: `
    SELECT e.id, e.name, e.code_employee, e.login_main_system, e.status_active, e.date_register, e.date_change_status, e.id_position, p.name AS position_name, e.id_sector, s.name AS sector_name, e.id_shift, sh.name AS shift_name, e.id_user_create, uc.name AS created_by, e.id_last_user_change, ul.name AS last_changed_by 
      FROM employee e 
      INNER JOIN position p ON e.id_position = p.id 
      LEFT JOIN sector s ON e.id_sector = s.id 
      INNER JOIN shift sh ON e.id_shift = sh.id 
      INNER JOIN "user" uc ON e.id_user_create = uc.id 
      INNER JOIN "user" ul ON e.id_last_user_change = ul.id 
      WHERE e.id = $1;`,

  // Querry to select all employees
  qSelectEmployees: `SELECT e.id, e.name, e.id_position, e.code_employee, e.login_main_system, e.id_sector, e.id_shift, e.status_active, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM employee e ORDER BY e.name ASC;`,

  // Query to select all active employees
  qSelectActiveEmployees: `SELECT e.id, e.name, e.id_position, e.code_employee, e.login_main_system, e.id_sector, e.id_shift, e.status_active, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM employee e WHERE e.status_active = true ORDER BY e.name ASC;`,

  // Query to search employee by ID
  qSelectEmployeeById: `SELECT e.id, e.name, e.id_position, e.code_employee, e.login_main_system, e.id_sector, e.id_shift, e.status_active, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM employee e WHERE e.id = $1;`,

  // Query to search employee by name
  qSearchEmployeesByName: `SELECT e.id, e.name, e.id_position, e.code_employee, e.login_main_system, e.id_sector, e.id_shift, e.status_active, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM employee e WHERE e.name ILIKE '%' || $1 || '%' ORDER BY e.name ASC;`,

  // List all registered roles
  qSelectRoles: `SELECT id, name FROM role ORDER BY name ASC;`,

  // List all registered permissions
  qSelectPermissions: `SELECT id, name FROM permission ORDER BY name ASC;`,

  // Find a specific role
  qSelectRoleById: `SELECT id, name FROM role WHERE id = $1;`,

  // Check whether a permission is already associated with a role
  qCheckRolePermission: `SELECT 1 FROM role_permission WHERE id_role = $1 AND id_permission = $2;`,

  // Query to select all permissions connected to a specific role
  SelectPermissionsByRole: `SELECT p.id, p.name FROM permission p INNER JOIN role_permission rp ON p.id = rp.id_permission WHERE rp.id_role = $1 ORDER BY p.name ASC;`,

  // Query to select a role by its name
  qSelectRoleByName: `SELECT id, name FROM role WHERE LOWER(name) = LOWER($1);`,

  // Find users assigned to a role
  qSelectUsersByRole: `SELECT id FROM "user" WHERE id_role = $1;`,

  // Query to check whether another equipment record uses the heritage code
  qCheckDuplicateHeritageCode: `SELECT id FROM equipment WHERE heritage_code = $1 AND id <> $2;`,

  // Query to list all equipment
  qSelectAllEquipment: `SELECT e.id, e.name, e.id_equipment_type, et.name AS equipment_type, e.id_equipment_status, es.name AS equipment_status, e.heritage_code, e.id_sector, s.name AS sector_name, e.observation, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM equipment e INNER JOIN equipment_type et ON e.id_equipment_type = et.id INNER JOIN equipment_status es ON e.id_equipment_status = es.id LEFT JOIN sector s ON e.id_sector = s.id ORDER BY e.name ASC;`,

  // Query to validate equipment type
  qSelectEquipmentTypeById: `SELECT id FROM equipment_type WHERE id = $1;`,

  // Query to validate equipment status
  qSelectEquipmentStatusById: `SELECT id FROM equipment_status WHERE id = $1;`,

  // Query to validate sector
  qSelectSectorById: `SELECT id FROM sector WHERE id = $1;`,

  // Query to find equipment by ID
  qSelectEquipmentById: `SELECT e.id, e.name, e.id_equipment_type, et.name AS equipment_type, e.id_equipment_status, es.name AS equipment_status, e.heritage_code, e.id_sector, s.name AS sector_name, e.observation, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM equipment e INNER JOIN equipment_type et ON e.id_equipment_type = et.id INNER JOIN equipment_status es ON e.id_equipment_status = es.id LEFT JOIN sector s ON e.id_sector = s.id WHERE e.id = $1;`,

  // Query to find equipment by name
  qSelectEquipmentByName: `SELECT e.id, e.name, e.id_equipment_type, et.name AS equipment_type, e.id_equipment_status, es.name AS equipment_status, e.heritage_code, e.id_sector, s.name AS sector_name, e.observation, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM equipment e INNER JOIN equipment_type et ON e.id_equipment_type = et.id INNER JOIN equipment_status es ON e.id_equipment_status = es.id LEFT JOIN sector s ON e.id_sector = s.id WHERE e.name ILIKE '%' || $1 || '%' ORDER BY e.name ASC;`,

  // Query to check whether a heritage code is already registered
  qSelectEquipmentByHeritageCode: `SELECT id FROM equipment WHERE heritage_code = $1;`,

  // Query to list attendance records for a specific date
  qSelectAttendanceByDate: `SELECT a.id, a.id_employee, e.name AS employee_name, a.id_attendance_status, ast.name AS attendance_status, a.date, a.observation, a.date_register, a.date_last_change, a.id_user_create, a.id_last_user_change FROM attendance a INNER JOIN employee e ON a.id_employee = e.id INNER JOIN attendance_status ast ON a.id_attendance_status = ast.id WHERE a.date = $1 ORDER BY e.name ASC;`,

  // Query to find attendance records for a specific employee
  qSelectAttendanceByEmployee: `SELECT a.id, a.id_employee, e.name AS employee_name, a.id_attendance_status, ast.name AS attendance_status, a.date, a.observation, a.date_register, a.date_last_change, a.id_user_create, a.id_last_user_change FROM attendance a INNER JOIN employee e ON a.id_employee = e.id INNER JOIN attendance_status ast ON a.id_attendance_status = ast.id WHERE a.id_employee = $1 ORDER BY a.date DESC;`,

  // Query to find an employee's attendance on a specific date
  qSelectAttendanceByEmployeeAndDate: `SELECT a.id, a.id_employee, e.name AS employee_name, a.id_attendance_status, ast.name AS attendance_status, a.date, a.observation, a.date_register, a.date_last_change, a.id_user_create, a.id_last_user_change FROM attendance a INNER JOIN employee e ON a.id_employee = e.id INNER JOIN attendance_status ast ON a.id_attendance_status = ast.id WHERE a.id_employee = $1 AND a.date = $2;`,

  // Query to find attendance by record ID
  qSelectAttendanceById: `SELECT id, id_employee, id_attendance_status, date, observation, id_user_create, id_last_user_change FROM attendance WHERE id = $1;`,

  // Query to find employee by ID
  qSelectAttendanceEmployeeById: `SELECT id, name, status_active FROM employee WHERE id = $1;`,

  // Query to find attendance status by ID
  qSelectAttendanceStatusById: `SELECT id, name FROM attendance_status WHERE id = $1;`,

  // Query to find "Presente" status
  qSelectPresentStatus: `SELECT id FROM attendance_status WHERE name = 'Presente';`,

  // Query to select the date for the dashboard
  qDashboardDate: `SELECT COALESCE($1::date, CURRENT_DATE)::text AS date;`,

  // Query to count the amount of active employees
  qDashboardActiveEmployees: `SELECT COUNT(*)::int AS total_active_employees FROM employee WHERE status_active = TRUE;`,

  // Query to show a summary of attendance
  qDashboardAttendanceSummary: `SELECT COUNT(*) FILTER (WHERE ast.name = 'Presente')::int AS present, COUNT(*) FILTER (WHERE ast.name = 'Falta injustificada')::int AS absent, COUNT(*) FILTER (WHERE ast.name = 'Atestado')::int AS justified_absences, COUNT(*) FILTER (WHERE a.id IS NULL)::int AS not_registered, COUNT(*) FILTER (WHERE ast.name IN ('Banco de horas', 'Afastado', 'Férias'))::int AS other_statuses FROM employee e LEFT JOIN attendance a ON a.id_employee = e.id AND a.date = COALESCE($1::date, CURRENT_DATE) LEFT JOIN attendance_status ast ON ast.id = a.id_attendance_status WHERE e.status_active = TRUE;`,

  // Query to count equipment
  qDashboardEquipmentTotal: `SELECT COUNT(*)::int AS total FROM equipment;`,

  // Query to count equipment by status
  qDashboardEquipmentByStatus: `SELECT es.id AS id_status, es.name AS status, COUNT(e.id)::int AS quantity FROM equipment_status es LEFT JOIN equipment e ON e.id_equipment_status = es.id GROUP BY es.id, es.name ORDER BY es.name;`,

  // Query to count equipment by type
  qDashboardEquipmentByType: `SELECT et.id AS id_type, et.name AS type, COUNT(e.id)::int AS quantity FROM equipment_type et LEFT JOIN equipment e ON e.id_equipment_type = et.id GROUP BY et.id, et.name ORDER BY et.name;`,

  // Query to select shifts
  qSelectShifts: `SELECT id, name, hour_start, hour_end FROM shift ORDER BY hour_start ASC, name ASC;`,

  // Query to select shift by ID
  qSelectShiftById: `SELECT id, name, hour_start, hour_end FROM shift WHERE id = $1;`,

  // Query to select shift by name
  qSelectShiftByName: `SELECT id, name FROM shift WHERE LOWER(name) = LOWER($1);`,

  qSelectShiftByNameExceptId: `SELECT id, name FROM shift WHERE LOWER(name) = LOWER($1) AND id <> $2;`,

  qSelectShiftEmployeeUsage: `SELECT COUNT(*)::int AS total FROM employee WHERE id_shift = $1;`,

  //
  //
  // INSERTS

  // Query to insert new user to database (Without password)
  qAddNewUser: `INSERT INTO "user" (name, email, password_hash, id_role, date_register, date_change_status) 
		VALUES ($1, $2, $3, $4, NOW(), NOW());`,

  // Query to add new refresh token
  qAddRefreshToken: `INSERT INTO refresh_tokens (id, token, expiration) VALUES ($1, $2, $3);`,

  // Query to ad employee
  qAddEmployee: `INSERT INTO employee (name, id_position, code_employee, login_main_system, id_sector, id_shift, status_active, date_register, id_user_create, id_last_user_change) VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, $7, $7) RETURNING *;`,

  // Create a new role
  qAddRole: `INSERT INTO role (name) VALUES ($1) RETURNING id, name;`,

  // Add permission to role
  qAddRolePermission: `INSERT INTO role_permission (id_role, id_permission) VALUES ($1, $2);`,

  // Register equipment
  qAddEquipment: `INSERT INTO equipment (name, id_equipment_type, id_equipment_status, heritage_code, id_sector, observation, id_user_create, id_last_user_change) VALUES ($1, $2, $3, $4, $5, $6, $7, $7) RETURNING *;`,

  // Register employee attendance
  qAddAttendance: `INSERT INTO attendance (id_employee, id_attendance_status, date, observation, id_user_create, id_last_user_change) VALUES ($1, $2, $3, $4, $5, $5) RETURNING *;`,

  // Mark all active employees as present for a specific date, skipping existing records
  qMarkAllEmployeesPresent: `INSERT INTO attendance (id_employee, id_attendance_status, date, observation, id_user_create, id_last_user_change) SELECT e.id, ast.id, $1::date, NULL, $2, $2 FROM employee e CROSS JOIN attendance_status ast WHERE e.status_active = TRUE AND ast.name = 'Presente' ON CONFLICT (id_employee, date) DO NOTHING RETURNING id, id_employee, date, id_attendance_status;`,

  // Query to add shift
  qAddShift: `INSERT INTO shift (name, hour_start, hour_end) VALUES ($1, $2, $3) RETURNING id, name, hour_start, hour_end;`,

  //
  //
  // UPDATES

  // Querry to update user
  qUpdateUser: `UPDATE "user" 
      SET name = $1, email = $2, id_role = $3 WHERE id = $4;`,

  // Query to make user inactive
  qDeactivateUser: `UPDATE "user" 
      SET status_active = NOT status_active, date_change_status = NOW()
          WHERE id = $1;`,

  qUpdateEmployee: `UPDATE employee 
    SET name = $1, id_position = $2, code_employee = $3, login_main_system = $4, id_sector = $5, id_shift = $6, id_last_user_change = $7 
      WHERE id = $8 RETURNING *;`,

  qActivateEmployee: `UPDATE employee SET status_active = true, date_change_status = CURRENT_TIMESTAMP, id_last_user_change = $1 WHERE id = $2 RETURNING *;`,

  // Query to deactivate employee
  qDeactivateEmployee: `UPDATE employee SET status_active = false, date_change_status = CURRENT_TIMESTAMP, id_last_user_change = $1 WHERE id = $2 RETURNING *;`,

  // Query to change employee status
  qUpdateEmployeeStatus: `UPDATE employee SET status_active = $1, date_change_status = CURRENT_TIMESTAMP, id_last_user_change = $2 WHERE id = $3 RETURNING *;`,

  // Edit an existing role
  qUpdateRole: `UPDATE role SET name = $1 WHERE id = $2 RETURNING id, name;`,

  // Update equipment details
  qUpdateEquipment: `UPDATE equipment SET name = $1, id_equipment_type = $2, heritage_code = $3, id_sector = $4, observation = $5, id_last_user_change = $6 WHERE id = $7 RETURNING *;`,

  // Update equipment status
  qUpdateEquipmentStatus: `UPDATE equipment SET id_equipment_status = $1, id_last_user_change = $2 WHERE id = $3 RETURNING *;`,

  // Update employee attendance
  qUpdateAttendance: `UPDATE attendance SET id_attendance_status = $1, observation = $2, id_last_user_change = $3 WHERE id = $4 RETURNING *;`,

  // Query to update shift
  qUpdateShift: `UPDATE shift SET name = $1, hour_start = $2, hour_end = $3 WHERE id = $4 RETURNING id, name, hour_start, hour_end;`,

  //
  //
  // DELETE

  // Query to delete user
  qDeleteUser: `DELETE FROM "user" WHERE id = $1;`,

  // Query to delete refresh tokens by ID
  qDeleteRefreshTokenByID: `DELETE FROM refresh_tokens WHERE id = $1;`,

  // Query to delete expired tokens
  qDeleteRefreshTokenByExpirationDate: `DELETE FROM refresh_tokens WHERE vence_em < NOW();`,

  // Query to delete employee by ID
  qDeleteEmployee: `DELETE FROM employee WHERE id = $1 RETURNING *;`,

  // Delete a role only if a user doesn't have it
  qDeleteRole: `DELETE FROM role WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM "user" u WHERE u.id_role = $1) RETURNING id, name;`,

  // Remove a permission from a role
  qDeleteRolePermission: `DELETE FROM role_permission WHERE id_role = $1 AND id_permission = $2 RETURNING id_role, id_permission;`,

  // Remove all permissions from a role
  qDeleteAllRolePermissions: `DELETE FROM role_permission WHERE id_role = $1 RETURNING id_role, id_permission;`,

  // Query to delete shift
  qDeleteShift: `DELETE FROM shift WHERE id = $1 RETURNING id, name;`,
};
