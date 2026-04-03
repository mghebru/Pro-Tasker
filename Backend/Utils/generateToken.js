import jwt from "jsonwebtoken";

// Generates a JSON Web Token for user authentication
const generateToken = (id) => {
  // Create JWT with user ID payload, signed with secret key
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d" // Token expires in 30 days
  });
};

// Export the token generation function
export default generateToken;