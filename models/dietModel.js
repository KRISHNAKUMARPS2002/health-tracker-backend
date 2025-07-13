const db = require("../config/db");

const insertDietPlan = async (userId, data) => {
  const query = `
    INSERT INTO diet_plans (user_id, title, description, meals)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [userId, data.title, data.description, data.meals];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getDietPlansByUser = async (userId) => {
  const query = `SELECT * FROM diet_plans WHERE user_id = $1 ORDER BY created_at DESC;`;
  const result = await db.query(query, [userId]);
  return result.rows;
};

const updateDietPlanById = async (id, userId, updateData) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (let key in updateData) {
    fields.push(`${key} = $${i}`);
    values.push(updateData[key]);
    i++;
  }

  fields.push(`updated_at = NOW()`);
  values.push(id, userId);

  const query = `
    UPDATE diet_plans
    SET ${fields.join(", ")}
    WHERE id = $${i} AND user_id = $${i + 1}
    RETURNING *;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

module.exports = {
  insertDietPlan,
  getDietPlansByUser,
  updateDietPlanById,
};
