import Project from "../models/Project.js";

// Create
export const createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    owner: req.user._id
  });
  res.status(201).json(project);
};

// Get all (authorized users only)
export const getProjects = async (req, res) => {
  const projects = await Project.find({ owner: req.user._id });
  res.json(projects);
};

// Get single
export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) return res.status(404).json({ message: "Not found" });

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json(project);
};

// Update
export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) return res.status(404).json({ message: "Not found" });

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  Object.assign(project, req.body);
  const updated = await project.save();

  res.json(updated);
};

// Delete
export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) return res.status(404).json({ message: "Not found" });

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await project.deleteOne();
  res.json({ message: "Project removed" });
};