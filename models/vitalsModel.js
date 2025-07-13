const db = require("../config/db");

const insertVitals = async (userId, data) => {
  const query = `
    INSERT INTO vitals (
      user_id, blood_pressure, sugar_level, heart_rate, temperature,
      spo2, weight, bmi, notes, measured_at, status, source
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *;
  `;

  const values = [
    userId,
    data.bloodPressure,
    data.sugarLevel,
    data.heartRate,
    data.temperature,
    data.spo2,
    data.weight,
    data.bmi,
    data.notes,
    data.measuredAt,
    data.status,
    data.source,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

const getVitalsByUserId = async (userId) => {
  const query = `SELECT * FROM vitals WHERE user_id = $1 ORDER BY measured_at DESC;`;
  const result = await db.query(query, [userId]);
  return result.rows;
};

const updateVitalsById = async (vitalId, userId, updateData) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (let key in updateData) {
    fields.push(`${key} = $${i}`);
    values.push(updateData[key]);
    i++;
  }

  fields.push(`updated_at = NOW()`);
  values.push(vitalId, userId);

  const query = `
    UPDATE vitals
    SET ${fields.join(", ")}
    WHERE id = $${i} AND user_id = $${i + 1}
    RETURNING *;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

module.exports = {
  insertVitals,
  getVitalsByUserId,
  updateVitalsById,
};
