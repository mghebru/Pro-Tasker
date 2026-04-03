import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes by verifying JWT token and attaching user to request
export const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header (Bearer token format)
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Return error if no token provided
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify JWT token with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password for security)
    req.user = await User.findById(decoded.id).select("-password");
    next();

  } catch (error) {
    // Return error for invalid or expired tokens
    res.status(401).json({ message: "Token not valid" });
  }
};