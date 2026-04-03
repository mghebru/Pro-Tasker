import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProjectDetails() {
  const { id: projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Load project data when component starts
  useEffect(() => {
    loadProject();
    loadTasks();
  }, [projectId]);

  // Get project information
  const loadProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}`, { headers });
      setProject(response.data);
    } catch (err) {
      setError("Could not load project");
    }
  };

  // Get all tasks for this project
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`, { headers });
      setTasks(response.data);
      setError("");
    } catch (err) {
      setError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (newTaskTitle.trim() === "") {
      setError("Enter a task title");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/projects/${projectId}/tasks`,
        { title: newTaskTitle },
        { headers }
      );

      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
      setError("");
    } catch (err) {
      setError("Could not create task");
    } finally {
      setLoading(false);
    }
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
  };

  // Save edited task
  const saveEdit = async (taskId) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        { title: editTitle, description: editDesc },
        { headers }
      );

      const updatedTasks = tasks.map(t => t._id === taskId ? response.data : t);
      setTasks(updatedTasks);
      setEditingTaskId(null);
    } catch (err) {
      setError("Could not update task");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDesc("");
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, { headers });
      const updatedTasks = tasks.filter(t => t._id !== taskId);
      setTasks(updatedTasks);
    } catch (err) {
      setError("Could not delete task");
    }
  };

  // Change task status
  const updateStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        { status: newStatus },
        { headers }
      );

      const updatedTasks = tasks.map(t => t._id === taskId ? response.data : t);
      setTasks(updatedTasks);
    } catch (err) {
      setError("Could not update task status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Project Header */}
        {project && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
            {project.description && <p className="text-lg text-gray-600">{project.description}</p>}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h2>

        {/* Show loading and error messages */}
        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Add New Task Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              {/* Editing Mode */}
              {editingTaskId === task._id && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Task description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(task._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* View Mode */}
              {editingTaskId !== task._id && (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                      {task.description && <p className="text-gray-600 mt-2">{task.description}</p>}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {task.status}
                    </span>
                  </div>

                  <div className="flex gap-2 items-center mt-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>

                    <button
                      onClick={() => startEdit(task)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

  //Create task
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/tasks`,
        { title: newTaskTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks([...tasks, res.data]);
      setNewTaskTitle("");
      setError("");
    } catch (err) {
      console.error("Error creating task:", err.response || err);
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  //Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Delete error:", err.response || err);
      setError("Failed to delete task");
    }
  };

  //Update status
  const handleUpdateStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error("Update error:", err.response || err);
      setError("Failed to update task");
    }
  };

  //Edit task
  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditingTaskData({ title: task.title, description: task.description });
  };

  //Save edited task
  const handleSaveEdit = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        editingTaskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
      setEditingTaskId(null);
      setEditingTaskData({});
    } catch (err) {
      console.error("Save edit error:", err.response || err);
      setError("Failed to update task");
    }
  };

  //Cancel edit
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskData({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {project && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-lg text-gray-600">{project.description}</p>
            )}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h2>

        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* 🔹 Add Task */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* 🔹 Task List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
            >
              {editingTaskId === task._id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingTaskData.title}
                    onChange={(e) =>
                      setEditingTaskData({
                        ...editingTaskData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editingTaskData.description}
                    onChange={(e) =>
                      setEditingTaskData({
                        ...editingTaskData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Task description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 mt-2">{task.description}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {task.status}
                    </span>
                  </div>

                  <div className="flex gap-2 items-center mt-4">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateStatus(task._id, e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>

                    <button
                      onClick={() => handleEditTask(task)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;