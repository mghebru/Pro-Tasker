import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

// Create Express router for authentication routes
const router = express.Router();

// POST /api/auth/register - Register a new user account
router.post("/register", registerUser);

// POST /api/auth/login - Authenticate user login
router.post("/login", loginUser);

// Export the authentication router
export default router;