const db = require("../config/db");

const createUser = async (userData) => {
  const { name, email, password, age, gender, marital_status, weight, height } =
    userData;

  const query = `
    INSERT INTO users 
    (name, email, password, age, gender, marital_status, weight, height)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, name, email, age, gender, marital_status, weight, height, created_at;
  `;

  const values = [
    name,
    email,
    password,
    age,
    gender,
    marital_status,
    weight,
    height,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};
