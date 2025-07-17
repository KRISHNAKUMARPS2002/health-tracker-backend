const { insertVitals, getVitalsByUserId } = require("../models/vitalsModel");
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

module.exports = {
  addVitals,
  getVitals,
};
