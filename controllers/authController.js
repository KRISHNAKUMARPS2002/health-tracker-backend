const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/hash");

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      marital_status,
      weight,
      height,
      blood_group,
    } = req.body;

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      marital_status,
      weight,
      height,
      blood_group,
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
