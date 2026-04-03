import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects routes by verifying JWT token and attaching user to request
export const protect = async (req, res, next) => {
  // Initialize token variable
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (req.headers.authorization?.startsWith("Bearer")) {
    // Extract token from "Bearer <token>" format
    token = req.headers.authorization.split(" ")[1];

    // Return error if no token found
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    try {
      // Verify JWT token with secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token payload and attach to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      // Continue to next middleware/route handler
      next();

    } catch {
      // Return error for invalid or expired tokens
      return res.status(401).json({ message: "Not authorized" });
    }
  }
};