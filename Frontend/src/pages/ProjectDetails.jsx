import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProjectDetails() {
  const { id: projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskData, setEditingTaskData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Fetch project details
  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProject(res.data);
    } catch (err) {
      console.error("Error fetching project:", err.response || err);
      setError(err.response?.data?.message || "Failed to load project");
    }
  };

  //Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/projects/${projectId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err.response || err);
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [projectId]);

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