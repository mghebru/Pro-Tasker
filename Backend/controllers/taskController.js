import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Create a new task for a project
export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const { projectId } = req.params;

    // Validate title is provided
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Check if project exists and user owns it
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Verify user owns the project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Create task with default values
    const task = await Task.create({
      title,
      description: description || "",
      status: status || "To Do",
      project: projectId,
      owner: req.user._id,
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// Get all tasks for a project
export const getTasks = async (req, res) => {
  const { projectId } = req.params;

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  // Verify user owns the project
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Find all tasks for this project
  const tasks = await Task.find({ project: projectId });
  res.json(tasks);
};

// Update a task
export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  // Get the project that owns this task
  const project = await Project.findById(task.project);
  if (!project) return res.status(404).json({ message: "Project not found" });

  // Verify user owns the project (and thus the task)
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Update task with new data
  Object.assign(task, req.body);
  const updated = await task.save();
  res.json(updated);
};

// Delete a task
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  // Get the project that owns this task
  const project = await Project.findById(task.project);
  if (!project) return res.status(404).json({ message: "Project not found" });

  // Verify user owns the project (and thus the task)
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};