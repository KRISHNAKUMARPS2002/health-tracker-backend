const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  addVitals,
  getVitals,
  updateVitals,
} = require("../controllers/vitalsController");

router.post("/", authenticateToken, addVitals);
router.get("/", authenticateToken, getVitals);

module.exports = router;
