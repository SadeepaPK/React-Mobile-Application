
const express = require("express");
const router = express.Router();

// Import authentication controllers
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

// Import authentication middleware
const authMiddleware = require("../middleware/auth");

// Public routes

// Sign up / Register
router.post("/register", registerUser);

// Sign in / Login
router.post("/login", loginUser);

// Protected route example
// Authentication middleware verifies the JWT before continuing
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated successfully",
    user: req.user,
  });
});

module.exports = router;
