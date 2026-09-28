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

  qSelectEmployeesFull: `
    SELECT e.id, e.name, e.code_employee, e.login_main_system, e.status_active, e.date_register, e.date_change_status, p.name AS position_name, s.name AS sector_name, sh.name AS shift_name 
      FROM employee e 
      INNER JOIN position p ON e.id_position = p.id 
      LEFT JOIN sector s ON e.id_sector = s.id 
      INNER JOIN shift sh ON e.id_shift = sh.id 
      ORDER BY e.name ASC;`,

  qSelectEmployeeFullById: `
    SELECT e.id, e.name, e.code_employee, e.login_main_system, e.status_active, e.date_register, e.date_change_status, e.id_position, p.name AS position_name, e.id_sector, s.name AS sector_name, e.id_shift, sh.name AS shift_name, e.id_user_create, uc.name AS created_by, e.id_last_user_change, ul.name AS last_changed_by 
      FROM employee e 
      INNER JOIN position p ON e.id_position = p.id 
      LEFT JOIN sector s ON e.id_sector = s.id 
      INNER JOIN shift sh ON e.id_shift = sh.id 
      INNER JOIN "user" uc ON e.id_user_create = uc.id 
      INNER JOIN "user" ul ON e.id_last_user_change = ul.id 
      WHERE e.id = $1;`,

  qSelectEmployees: `SELECT e.id, e.name, e.id_position, e.code_employee, e.login_main_system, e.id_sector, e.id_shift, e.status_active, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM employee e ORDER BY e.name ASC;`,

  qSelectActiveEmployees: `SELECT e.id, e.name, e.id_position, e.code_employee, e.login_main_system, e.id_sector, e.id_shift, e.status_active, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM employee e WHERE e.status_active = true ORDER BY e.name ASC;`,

  qSelectEmployeeById: `SELECT e.id, e.name, e.id_position, e.code_employee, e.login_main_system, e.id_sector, e.id_shift, e.status_active, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM employee e WHERE e.id = $1;`,

  qSearchEmployeesByName: `SELECT e.id, e.name, e.id_position, e.code_employee, e.login_main_system, e.id_sector, e.id_shift, e.status_active, e.date_register, e.date_change_status, e.id_user_create, e.id_last_user_change FROM employee e WHERE e.name ILIKE '%' || $1 || '%' ORDER BY e.name ASC;`,

  //
  //
  // INSERTS

  // Query to insert new user to database (Without password)
  qAddNewUser: `INSERT INTO "user" (name, email, password_hash, id_role, date_register, date_change_status) 
		VALUES ($1, $2, $3, $4, NOW(), NOW());`,

  // Query to add new refresh token
  qAddRefreshToken: `INSERT INTO refresh_tokens (id, token, expiration) VALUES ($1, $2, $3);`,

  qAddEmployee: `INSERT INTO employee (name, id_position, code_employee, login_main_system, id_sector, id_shift, status_active, date_register, id_user_create, id_last_user_change) VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, $7, $7) RETURNING *;`,

  qInsertEmployee: `INSERT INTO employee (name, id_position, code_employee, login_main_system, id_sector, id_shift, status_active, date_register, id_user_create, id_last_user_change) VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, $7, $7) RETURNING *;`,

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

  qDeactivateEmployee: `UPDATE employee SET status_active = false, date_change_status = CURRENT_TIMESTAMP, id_last_user_change = $1 WHERE id = $2 RETURNING *;`,

  qUpdateEmployeeStatus: `UPDATE employee SET status_active = $1, date_change_status = CURRENT_TIMESTAMP, id_last_user_change = $2 WHERE id = $3 RETURNING *;`,

  //
  //
  // DELETE

  // Query to delete user
  qDeleteUser: `DELETE FROM "user" WHERE id = $1;`,

  // Query to delete refresh tokens by ID
  qDeleteRefreshTokenByID: `DELETE FROM refresh_tokens WHERE id = $1;`,

  // Query to delete expired tokens
  qDeleteRefreshTokenByExpirationDate: `DELETE FROM refresh_tokens WHERE vence_em < NOW();`,

  qDeleteEmployee: `DELETE FROM employee WHERE id = $1 RETURNING *;`,
};
