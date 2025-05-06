'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTasks } from "@fortawesome/free-solid-svg-icons";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  createdBy: string;
  assignedTo?: string; // username string
}

export default function NotStartedTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ visible: boolean; taskId?: string }>({
    visible: false,
    taskId: undefined,
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res =>
        res.ok ? res.json() : Promise.reject("Failed to fetch tasks")
      )
      .then((data: { tasks: Task[] }) => {
        const notStartedTasks = data.tasks.filter(
          (task: Task) => task.status === "not-started"
        );
        setTasks(notStartedTasks);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tasks:", err);
        setError("Error fetching tasks");
        setLoading(false);
      });
  }, []);

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

      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Error deleting task");
    }
  };

  const handleEdit = (task: Task) => {
    router.push(`/tasks/edit?page=true&taskId=${task._id}`);
  };

  if (loading)
    return <p className="text-center mt-8">Loading not started tasks...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-6 bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon
            icon={faTasks}
            className="text-purple-600 h-8 w-8 animate-pulse"
          />
          <h1 className="text-3xl font-bold text-gray-800">Not Started Tasks</h1>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div
                key={task._id}
                className="p-5 bg-white rounded-lg shadow-sm border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mt-2">{task.description}</p>
                {task.assignedTo && (
                  <p className="text-sm text-gray-600 mt-1">
                    Assigned To: {task.assignedTo}
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
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm shadow-md">
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
                    onClick={() => setConfirmDelete({ visible: true, taskId: task._id })}
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition">
                      Delete Task
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No tasks found in Not Started.</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
      {confirmDelete.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
  );
}