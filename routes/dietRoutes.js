const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  addDietPlan,
  getDietPlans,
  updateDietPlan,
} = require("../controllers/dietController");

router.post("/", authenticateToken, addDietPlan);
router.get("/", authenticateToken, getDietPlans);
router.put("/:id", authenticateToken, updateDietPlan);

module.exports = router;
