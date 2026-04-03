import mongoose from "mongoose";

// Defines the Project model schema for task management projects
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Project name/title
    description: String, // Optional project description
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User", // Links to User collection
      required: true // Every project must have an owner
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Project model
export default mongoose.model("Project", projectSchema);