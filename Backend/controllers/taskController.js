import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Creates a new task for a specific project
export const createTask = async (req, res) => {
  // Debug log to see project ID from URL
  console.log("projectId:", req.params);

  try {
    // Extract task data from request body
    const { title, description, status } = req.body;
    // Get project ID from URL parameters
    const { projectId } = req.params;

    // Validate that title is provided
    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user owns the project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Create new task with default values
    const task = await Task.create({
      title,
      description: description || "", // Default to empty string
      status: status || "To Do", // Default status
      project: projectId, // Link to project
      owner: req.user._id, // Link to user
    });

    // Return created task with 201 status
    res.status(201).json(task);

  } catch (error) {
    // Log error for debugging
    console.error("CREATE TASK ERROR:", error.message);
    // Return error response
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// Gets all tasks for a specific project
export const getTasks = async (req, res) => {
  // Get project ID from URL parameters
  const { projectId } = req.params;

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  // Check if current user owns the project
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Find all tasks for this project
  const tasks = await Task.find({ project: projectId });

  // Return array of tasks
  res.json(tasks);
};

// Updates an existing task
export const updateTask = async (req, res) => {
  // Find task by ID from URL parameter
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  // Find the project this task belongs to
  const project = await Project.findById(task.project);
  if (!project) return res.status(404).json({ message: "Project not found" });

  // Check if current user owns the project (and thus the task)
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Update task with new data from request body
  Object.assign(task, req.body); // title, description, status, etc.
  // Save updated task to database
  const updated = await task.save();

  // Return updated task data
  res.json(updated);
};

// Deletes a task
export const deleteTask = async (req, res) => {
  // Find task by ID from URL parameter
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  // Find the project this task belongs to
  const project = await Project.findById(task.project);
  if (!project) return res.status(404).json({ message: "Project not found" });

  // Check if current user owns the project (and thus the task)
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Delete task from database
  await task.deleteOne();

  // Return success message
  res.json({ message: "Task removed" });
};