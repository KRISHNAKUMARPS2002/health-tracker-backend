const db = require("../config/db");

// Insert new vitals (keep only latest 30 per user)
const insertVitals = async (userId, data) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // 1. Count vitals for this user
    const countQuery = `SELECT COUNT(*) FROM vitals WHERE user_id = $1;`;
    const countResult = await client.query(countQuery, [userId]);
    const count = parseInt(countResult.rows[0].count);

    // 2. If more than or equal to 30, delete the oldest one
    if (count >= 30) {
      const deleteOldestQuery = `
        DELETE FROM vitals 
        WHERE id = (
          SELECT id FROM vitals 
          WHERE user_id = $1 
          ORDER BY measured_at ASC 
          LIMIT 1
        );
      `;
      await client.query(deleteOldestQuery, [userId]);
    }

    // 3. Insert new vitals
    const insertQuery = `
      INSERT INTO vitals (
        user_id, blood_pressure, sugar_level, heart_rate, temperature,
        spo2, weight, bmi, notes, measured_at, status, source, reasons
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
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
      data.reasons,
    ];
    const insertResult = await client.query(insertQuery, values);

    await client.query("COMMIT");
    return insertResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Get latest vitals for a user
const getVitalsByUserId = async (userId) => {
  const query = `
    SELECT 
      v.*, 
      u.height 
    FROM vitals v
    JOIN users u ON v.user_id = u.id
    WHERE v.user_id = $1
    ORDER BY v.measured_at DESC;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

module.exports = {
  insertVitals,
  getVitalsByUserId,
};
