import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Create task
export const createTask = async (req, res) => {
  console.log("projectId:", req.params);
  try {
    const { title, description, status } = req.body;
    const { projectId } = req.params;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      status: status || "To Do",
      project: projectId,
      owner: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error.message);
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// Get tasks for project
export const getTasks = async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const tasks = await Task.find({ project: projectId });
  res.json(tasks);
};

// Update task
export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const project = await Project.findById(task.project);
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  Object.assign(task, req.body); // title, description, status, etc.
  const updated = await task.save();

  res.json(updated);
};

// Delete task
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const project = await Project.findById(task.project);
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.json({ message: "Task removed" });
};