const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

//Protected Routes
router.get("/me", authenticateToken, getProfile);
router.put("/me", authenticateToken, updateProfile);

module.exports = router;
