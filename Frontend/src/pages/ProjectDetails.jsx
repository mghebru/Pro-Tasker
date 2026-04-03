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

  useEffect(() => {
    loadProject();
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const loadProject = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects/${projectId}`, { headers });
      setProject(res.data);
      setError("");
    } catch (err) {
      setError("Could not load project");
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/projects/${projectId}/tasks`, { headers });
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      setError("Enter a task title");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/projects/${projectId}/tasks`,
        { title: newTaskTitle },
        { headers }
      );
      setTasks((prev) => [...prev, res.data]);
      setNewTaskTitle("");
      setError("");
    } catch (err) {
      setError("Could not create task");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title || "");
    setEditDesc(task.description || "");
  };

  const saveEdit = async (taskId) => {
    try {
      const res = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        { title: editTitle, description: editDesc },
        { headers }
      );
      setTasks((prev) => prev.map((task) => (task._id === taskId ? res.data : task)));
      setEditingTaskId(null);
      setEditTitle("");
      setEditDesc("");
      setError("");
    } catch (err) {
      setError("Could not update task");
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDesc("");
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, { headers });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setError("");
    } catch (err) {
      setError("Could not delete task");
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        { status: newStatus },
        { headers }
      );
      setTasks((prev) => prev.map((task) => (task._id === taskId ? res.data : task)));
      setError("");
    } catch (err) {
      setError("Could not update task status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {project && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
            {project.description && <p className="text-lg text-gray-600">{project.description}</p>}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h2>

        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

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

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              {editingTaskId === task._id ? (
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
                    rows={3}
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
              ) : (
                <>
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
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
