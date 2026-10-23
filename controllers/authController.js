
const User = require("../model/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, secret, { expiresIn });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check required fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    // Check whether the email already exists
    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email address is already registered",
      });
    }

    // Create user (password is hashed by the User model's pre-save hook)
    const user = await User.create({
      userName,
      email,
      password,
    });

    // Generate JWT
    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle duplicate email index errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email address is already registered",
      });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

// Log in an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({email});

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with stored bcrypt hash
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

// @desc Get current logged in user
// @route GET /api/v1/auth/me
// @access Private
const getMe = async(req, res) => {
  try{
    const user = await User.findOne(req.user.id);
    res.status(200).json({
      message: "There has a User",
      success: true,
      data:user
    })
  }
  catch{
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe
};
