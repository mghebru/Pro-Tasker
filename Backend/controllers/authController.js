import User from "../models/User.js";
import generateToken from "../Utils/generateToken.js";

// Register a new user account
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email is already registered
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Create new user in database
  const user = await User.create({ name, email, password });

  // Return user data with JWT token
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
};

// Login user and return JWT token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Verify user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};