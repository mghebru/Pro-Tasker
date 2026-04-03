import mongoose from "mongoose";

// Defines the Task model schema for individual tasks within projects
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Task title/name
    description: String, // Optional task description
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"], // Only allow these status values
      default: "To Do" // Default status for new tasks
    },
    project: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Project model
      ref: "Project", // Links to Project collection
      required: true // Every task must belong to a project
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User", // Links to User collection
      required: true // Every task must have an owner
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Task model
export default mongoose.model("Task", taskSchema);