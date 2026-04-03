import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, [token]);

  const loadProjects = async () => {
    if (!token) return;

    try {
      const response = await API.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (err) {
      setError("Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-blue-600 mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <Link to="/projects/new" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            + Create New Project
          </Link>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No projects yet</p>
            <Link to="/projects/new" className="text-blue-600 hover:text-blue-700 font-medium">
              Create your first project
            </Link>
          </div>
        )}

        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`} className="block group">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full border-t-4 border-blue-500">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {project.description}
                    </p>
                  )}
                  <div className="text-sm text-gray-500 group-hover:text-blue-600">
                    View Project →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}