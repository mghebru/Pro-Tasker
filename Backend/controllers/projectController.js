import Project from "../models/Project.js";

// Create a new project
export const createProject = async (req, res) => {
  // Create project with owner set to current user
  const project = await Project.create({
    ...req.body,
    owner: req.user._id
  });
  res.status(201).json(project);
};

// Get all projects for current user
export const getProjects = async (req, res) => {
  const projects = await Project.find({ owner: req.user._id });
  res.json(projects);
};

// Get single project by ID
export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) return res.status(404).json({ message: "Project not found" });

  // Verify user owns this project
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json(project);
};

// Update project
export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) return res.status(404).json({ message: "Project not found" });

  // Verify user owns this project
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Update with new data
  Object.assign(project, req.body);
  const updated = await project.save();
  res.json(updated);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) return res.status(404).json({ message: "Project not found" });

  // Verify user owns this project
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await project.deleteOne();
  res.json({ message: "Project deleted" });
};