import mongoose from "mongoose";

// Define Task schema for individual tasks within projects
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String, // Optional task description
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do"
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Reference to Project model
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);