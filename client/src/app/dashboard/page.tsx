'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";


interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  createdBy: string;
  assignedTo?: string[]; // array of usernames
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<{ visible: boolean; taskId?: string }>({
    visible: false,
    taskId: undefined,
  });

  const router = useRouter();

  // Fetch tasks whenever the priorityFilter changes.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const endpoint = priorityFilter !== ""
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/filtered?priority=${priorityFilter}`
  : `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`;

    fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) =>
        res.ok
          ? res.json()
          : res.text().then((text) => {
              throw new Error(text || "Failed to fetch tasks");
            })
      )
      .then((data) => {
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setError("Error fetching tasks");
        setLoading(false);
      });
  }, [priorityFilter]);

  const handleDelete = async (taskId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Error deleting task");
    }
  };

  const handleEdit = (task: Task) => {
    router.push(`/tasks/edit?page=true&taskId=${task._id}`);
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon
              icon={faTasks}
              className="text-blue-600 h-8 w-8 animate-pulse"
            />
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/tasks/create")}
          >
            + Create Task
          </button>
        </div>

        {/* Filter section */}
        <div className="mb-4 flex items-center space-x-3">
          <label htmlFor="priorityFilter" className="font-medium">
            Filter by Priority:
          </label>
          <select
            id="priorityFilter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-5 bg-white rounded-lg shadow-sm border border-gray-300 transition-shadow duration-300 hover:shadow-xl"
            >
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-600">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm">{task.description}</p>
              {task.assignedTo && task.assignedTo.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Assigned To: {task.assignedTo.join(", ")}
                </p>
              )}

              <div className="mt-3 flex justify-between items-center">
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full shadow-md ${
                    task.priority.toLowerCase() === "high"
                      ? "bg-red-500 text-white"
                      : task.priority.toLowerCase() === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority} Priority
                </span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm shadow-md">
                  {task.status}
                </span>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="relative group text-yellow-500 hover:text-yellow-600 transition-transform hover:scale-110 focus:outline-none"
                  onClick={() => handleEdit(task)}
                >
                  <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition">
                    Edit Task
                  </span>
                </button>

                <button
                  className="relative group text-red-500 hover:text-red-600 transition-transform hover:scale-110 focus:outline-none"
                  onClick={() =>
                    setConfirmDelete({ visible: true, taskId: task._id })
                  }
                >
                  <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition ">
                    Delete Task
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation Dialog for Task Deletion */}
        {confirmDelete.visible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to delete this task?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
                  onClick={() => setConfirmDelete({ visible: false })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                  onClick={() => {
                    handleDelete(confirmDelete.taskId!);
                    setConfirmDelete({ visible: false });
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}