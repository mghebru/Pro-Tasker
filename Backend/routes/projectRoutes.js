import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

/**
 * Project routes
 * Base: /api/projects
 */
router
  .route("/")
  .get(protect, getProjects)
  .post(protect, createProject);

router
  .route("/:projectId")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

/**
 * Task routes (scoped to a project)
 * Base: /api/projects/:projectId/tasks
 */
router
  .route("/:projectId/tasks")
  .get(protect, getTasks)
  .post(protect, createTask);

/**
 * Single task routes (update/delete)
 * Base: /api/projects/:projectId/tasks/:taskId
 *
 * Note: `updateTask` / `deleteTask` only use `req.params.taskId` today.
 * `projectId` is in the URL for clarity and REST structure.
 */
router
  .route("/:projectId/tasks/:taskId")
  .patch(protect, updateTask) // change to .put(...) if your frontend uses PUT
  .delete(protect, deleteTask);

export default router;
