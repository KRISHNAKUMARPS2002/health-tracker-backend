// config/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");
const logger = require("../utils/logger");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => logger.info("✅ PostgreSQL connected"))
  .catch((err) => logger.error("❌ DB connection failed: " + err));

module.exports = pool;
