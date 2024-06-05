const { Pool } = require("pg");

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}
`;

async function createConnection() {
  const pool = new Pool({
    connectionString,
    allowExitOnIdle: true,
    ssl: {
        rejectUnauthorized: false
    }
  });
  return await pool.connect();
}

function endConnection(db) {
  db.release();
}

module.exports = {
  createConnection,
  endConnection,
};