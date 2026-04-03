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

const router = express.Router();

//project routes
router.get("/", protect, getProjects);
router.post("/", protect, createProject); //create project

router.route("/")
  .post(protect, createProject)
  .get(protect, getProjects);

router.route("/:projectId")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);
  
  //task routes
  router.route("/:projectId/tasks")
  .get(protect, getTasks)
  .post(protect, createTask);
export default router;