// utils/vitalsUtils.js
function classifyVitals(v) {
  const reasons = [];
  let status = "Normal";

  // --- Critical conditions ---
  if (v.temperature > 102) {
    reasons.push(`High temperature: ${v.temperature}°F`);
    status = "Critical";
  }

  if (v.spo2 < 90) {
    reasons.push(`Low SpO2 level: ${v.spo2}%`);
    status = "Critical";
  }

  // --- Warning conditions (only if not already Critical) ---
  if (status !== "Critical") {
    if (v.temperature > 100) {
      reasons.push(`Slightly elevated temperature: ${v.temperature}°F`);
      status = "Warning";
    }

    if (v.spo2 >= 90 && v.spo2 < 95) {
      reasons.push(`Slightly low SpO2 level: ${v.spo2}%`);
      status = "Warning";
    }

    if (v.heart_rate < 50 || v.heart_rate > 110) {
      reasons.push(`Abnormal heart rate: ${v.heart_rate} bpm`);
      status = "Warning";
    }
  }

  return { status, reasons };
}

function calculateBMI(weight, heightInCm) {
  if (!weight || !heightInCm) return null;
  const heightInM = heightInCm / 100;
  return parseFloat((weight / (heightInM * heightInM)).toFixed(2));
}

module.exports = { calculateBMI, classifyVitals };
