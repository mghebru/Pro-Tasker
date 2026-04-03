import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Defines the User model schema with authentication fields
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // User's full name
    email: { type: String, required: true, unique: true }, // Unique email address
    password: { type: String, required: true } // Hashed password
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Hash password before saving to database
userSchema.pre("save", async function (next) {
  // Skip if password hasn't been modified
  if (!this.isModified("password")) return next();

  // Generate salt for password hashing
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Return boolean indicating if passwords match
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
export default mongoose.model("User", userSchema);