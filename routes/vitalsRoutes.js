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
router.put("/:id", authenticateToken, updateVitals);

module.exports = router;
