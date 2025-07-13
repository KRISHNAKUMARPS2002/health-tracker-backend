const db = require("../config/db");

const createUser = async (userData) => {
  const {
    name,
    email,
    password,
    age,
    gender,
    marital_status,
    weight,
    height,
    blood_group,
  } = userData;

  const query = `
    INSERT INTO users 
    (name, email, password, age, gender, marital_status, weight, height, blood_group)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, name, email, age, gender, marital_status, weight, height, blood_group, created_at;
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
    blood_group,
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

const findUserById = async (id) => {
  const result = await db.query(
    "SELECT id, name, email, age, gender, marital_status, weight, height, blood_group, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const updateUserById = async (id, updateData) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (let key in updateData) {
    fields.push(`${key} = $${index}`);
    values.push(updateData[key]);
    index++;
  }

  values.push(id);

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, name, email, age, gender, marital_status, weight, height, blood_group, created_at;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
};
