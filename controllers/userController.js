const { findUserById, updateUserById } = require("../models/userModel");
const { hashPassword } = require("../utils/hash");

// GET /api/users/me
const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { password, weight, height, marital_status, age } = req.body;

    const updateData = {};

    if (password) {
      updateData.password = await hashPassword(password);
    }

    if (weight !== undefined) updateData.weight = weight;
    if (height !== undefined) updateData.height = height;
    if (age !== undefined) updateData.age = age;
    if (marital_status !== undefined)
      updateData.marital_status = marital_status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const updatedUser = await updateUserById(userId, updateData);

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
