import mongoose from "mongoose";

// Define Project schema for task management
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String, // Optional project description
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);