import User from "../models/User.js";
import generateToken from "../Utils/generateToken.js";

// Registers a new user account with name, email, and password
export const registerUser = async (req, res) => {
  // Extract user data from request body
  const { name, email, password } = req.body;

  // Check if user already exists with this email
  const userExists = await User.findOne({ email });
  if (userExists) {
    // Return error if user already exists
    return res.status(400).json({ message: "User exists" });
  }

  // Create new user in database
  const user = await User.create({ name, email, password });

  // Return success response with user data and JWT token
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
};

// Authenticates user login with email and password
export const loginUser = async (req, res) => {
  // Extract login credentials from request body
  const { email, password } = req.body;

  // Find user by email in database
  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    // Return success response with user data and JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    // Return error for invalid credentials
    res.status(401).json({ message: "Invalid credentials" });
  }
};