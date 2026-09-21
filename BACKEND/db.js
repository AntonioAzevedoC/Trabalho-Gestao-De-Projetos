const { Pool } = require("pg");

const dbProperties = {
  user: "postgres",
  host: "localhost",
  password: "password",
  database: "test",
  port: 8000,
};

const db = new Pool(dbProperties);

module.exports = db;
