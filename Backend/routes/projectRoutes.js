import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

import {
  createTask,
  getTasks
} from "../controllers/taskController.js";

// Create Express router for project and task routes
const router = express.Router();

// Project routes - all require authentication
// GET /api/projects - Get all projects for authenticated user
router.get("/", protect, getProjects);
// POST /api/projects - Create a new project
router.post("/", protect, createProject);

// Alternative route definitions using router.route()
// POST /api/projects - Create project
// GET /api/projects - Get all projects
router.route("/")
  .post(protect, createProject)
  .get(protect, getProjects);

// Individual project routes
// GET /api/projects/:projectId - Get single project by ID
// PUT /api/projects/:projectId - Update project
// DELETE /api/projects/:projectId - Delete project
router.route("/:projectId")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Task routes within projects
// GET /api/projects/:projectId/tasks - Get all tasks for a project
// POST /api/projects/:projectId/tasks - Create a new task in a project
router.route("/:projectId/tasks")
  .get(protect, getTasks)
  .post(protect, createTask);

// Export the project and task router
export default router;