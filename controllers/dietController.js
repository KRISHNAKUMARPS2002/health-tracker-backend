const {
  insertDietPlan,
  getDietPlansByUser,
  updateDietPlanById,
} = require("../models/dietModel");

const addDietPlan = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { title, description, meals } = req.body;

    const plan = await insertDietPlan(userId, { title, description, meals });

    res.status(201).json({ message: "Diet plan added", plan });
  } catch (err) {
    next(err);
  }
};

const getDietPlans = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const plans = await getDietPlansByUser(userId);
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

const updateDietPlan = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, description, meals } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (meals) updateData.meals = meals;

    const updated = await updateDietPlanById(id, userId, updateData);

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Diet plan not found or not yours" });
    }

    res.json({ message: "Diet plan updated", plan: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addDietPlan,
  getDietPlans,
  updateDietPlan,
};
