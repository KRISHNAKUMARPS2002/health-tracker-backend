const {
  insertVitals,
  getVitalsByUserId,
  updateVitalsById,
} = require("../models/vitalsModel");
const { findUserById } = require("../models/userModel");
const { calculateBMI, classifyVitals } = require("../utils/vitalsUtils");

const addVitals = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      bloodPressure,
      sugarLevel,
      heartRate,
      temperature,
      spo2,
      weight,
      notes,
      measuredAt,
      source = "manual",
    } = req.body;

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bmi = calculateBMI(weight, user.height);
    const { status, reasons } = classifyVitals({
      heart_rate: heartRate,
      temperature,
      spo2,
    });

    const vitals = await insertVitals(userId, {
      bloodPressure,
      sugarLevel,
      heartRate,
      temperature,
      spo2,
      weight,
      bmi,
      notes,
      measuredAt,
      status,
      reasons,
      source,
    });

    res.status(201).json({
      message: "Vitals added",
      status,
      reasons,
      vitals,
    });
  } catch (err) {
    next(err);
  }
};

const getVitals = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const vitals = await getVitalsByUserId(userId);
    res.json(vitals);
  } catch (err) {
    next(err);
  }
};

const updateVitals = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      bloodPressure,
      sugarLevel,
      heartRate,
      temperature,
      spo2,
      weight,
      height,
      notes,
      measuredAt,
      source,
    } = req.body;

    const updateData = {};

    if (bloodPressure) updateData.blood_pressure = bloodPressure;
    if (sugarLevel !== undefined) updateData.sugar_level = sugarLevel;
    if (heartRate !== undefined) updateData.heart_rate = heartRate;
    if (temperature !== undefined) updateData.temperature = temperature;
    if (spo2 !== undefined) updateData.spo2 = spo2;
    if (weight !== undefined) updateData.weight = weight;
    if (notes !== undefined) updateData.notes = notes;
    if (measuredAt) updateData.measured_at = measuredAt;
    if (source) updateData.source = source;

    // 🧠 Get user for height (needed for BMI)
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ⚙️ Recalculate BMI if weight is present
    if (weight) {
      updateData.bmi = calculateBMI(weight, user.height);
    }

    // ✅ Declare here to avoid ReferenceError
    let status = null;
    let reasons = [];

    // ⚙️ Recalculate status if any vitals changed
    if (heartRate || temperature || spo2) {
      const result = classifyVitals({
        heart_rate: heartRate,
        temperature,
        spo2,
      });
      status = result.status;
      reasons = result.reasons;
      updateData.status = status;
      updateData.reasons = reasons;
    }

    const updatedVitals = await updateVitalsById(id, userId, updateData);

    if (!updatedVitals)
      return res.status(404).json({ message: "Vitals not found or not yours" });

    res.json({
      message: "Vitals updated",
      status,
      reasons,
      vitals: updatedVitals,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addVitals,
  getVitals,
  updateVitals,
};
