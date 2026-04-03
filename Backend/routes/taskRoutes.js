import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true }); // Important to access parent params


// CREATE TASK
router.post("/:projectId/tasks", protect, createTask);

// GET TASKS FOR A PROJECT
router.get("/:projectId/tasks", protect, getTasks);

// UPDATE TASK
router.put("/tasks/:taskId", protect, updateTask);

// DELETE TASK
router.delete("/tasks/:taskId", protect, deleteTask);

export default router;