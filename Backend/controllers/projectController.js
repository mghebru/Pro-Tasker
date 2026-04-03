import Project from "../models/Project.js";

// Creates a new project with authenticated user as owner
export const createProject = async (req, res) => {
  // Create project with all request data plus owner ID
  const project = await Project.create({
    ...req.body,
    owner: req.user._id
  });

  // Return created project with 201 status
  res.status(201).json(project);
};

// Gets all projects owned by the authenticated user
export const getProjects = async (req, res) => {
  // Find all projects where owner matches current user
  const projects = await Project.find({ owner: req.user._id });

  // Return array of user's projects
  res.json(projects);
};

// Gets a single project by ID if user owns it
export const getProjectById = async (req, res) => {
  // Find project by ID from URL parameter
  const project = await Project.findById(req.params.projectId);

  // Return 404 if project doesn't exist
  if (!project) return res.status(404).json({ message: "Not found" });

  // Check if current user owns this project
  if (project.owner.toString() !== req.user._id.toString()) {
    // Return 403 if user doesn't own the project
    return res.status(403).json({ message: "Not authorized" });
  }

  // Return the project data
  res.json(project);
};

// Updates an existing project if user owns it
export const updateProject = async (req, res) => {
  // Find project by ID from URL parameter
  const project = await Project.findById(req.params.projectId);

  // Return 404 if project doesn't exist
  if (!project) return res.status(404).json({ message: "Not found" });

  // Check if current user owns this project
  if (project.owner.toString() !== req.user._id.toString()) {
    // Return 403 if user doesn't own the project
    return res.status(403).json({ message: "Not authorized" });
  }

  // Update project with new data from request body
  Object.assign(project, req.body);
  // Save updated project to database
  const updated = await project.save();

  // Return updated project data
  res.json(updated);
};

// Deletes a project if user owns it
export const deleteProject = async (req, res) => {
  // Find project by ID from URL parameter
  const project = await Project.findById(req.params.projectId);

  // Return 404 if project doesn't exist
  if (!project) return res.status(404).json({ message: "Not found" });

  // Check if current user owns this project
  if (project.owner.toString() !== req.user._id.toString()) {
    // Return 403 if user doesn't own the project
    return res.status(403).json({ message: "Not authorized" });
  }

  // Delete project from database
  await project.deleteOne();

  // Return success message
  res.json({ message: "Project removed" });
};