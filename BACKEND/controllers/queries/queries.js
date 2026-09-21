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

  //
  //
  // INSERTS

  // Query to insert new user to database (Without password)
  qAddNewUser: `INSERT INTO "user" (name, email, password_hash, id_role, date_register, date_change_status) 
		VALUES ($1, $2, $3, $4, NOW(), NOW());`,

  // Query to add new refresh token
  qAddRefreshToken: `INSERT INTO refresh_tokens (id, token, expiration) VALUES ($1, $2, $3);`,

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

  //
  //
  // DELETE

  // Query to delete user
  qDeleteUser: `DELETE FROM "user" WHERE id = $1;`,

  // Query to delete refresh tokens by ID
  qDeleteRefreshTokenByID: `DELETE FROM refresh_tokens WHERE id = $1;`,

  // Query to delete expired tokens
  qDeleteRefreshTokenByExpirationDate: `DELETE FROM refresh_tokens WHERE vence_em < NOW();`,
};
