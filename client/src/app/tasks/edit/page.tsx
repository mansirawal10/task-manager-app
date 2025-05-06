'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  username: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string[];
}

export default function EditTask() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("taskId");

  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching task from:",`${process.env.NEXT_PUBLIC_API_URL}/api/tasks${taskId}`)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Task data received:", data);
        
        if (!data.task) {
          console.error("❌ Task data is missing or undefined!");
          setError("Task not found.");
          setLoading(false);
          return;
        }
  
        setTask(data.task);
        setSelectedUsers(data.task.assignedTo || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Error fetching task:", error);
        setError("Error loading task data.");
        setLoading(false);
      });
  }, [taskId]);

  // Fetch available users
  useEffect(() => {

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then(res => {
      console.log("Users API response:", res);
      return res.text(); // Change from .json() to .text() for debugging
    })
    .then(data => {
      console.log("Raw API Response:", data); // ✅ Debugging output
      try {
        const jsonData = JSON.parse(data); // Attempt JSON parsing
        setUsers(jsonData.users);
      } catch (error) {
        console.error("❌ Failed to parse JSON:", error);
        setError("Invalid response format from server.");
      }
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      setError("Error loading users.");
    });
  }, []);

  // Calculate available users that are not currently selected.
  const availableUsers = users.filter(
    (user) => !selectedUsers.includes(user.username)
  );

  // Add the selected user from the dropdown and reset the select.
  const handleSelectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.value;
    if (username) {
      setSelectedUsers((prev) => [...prev, username]);
    }
    e.target.value = "";
  };

  // Remove a user from the selection.
  const handleRemoveUser = (username: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u !== username));
  };

  // Update the task and navigate to the dashboard on success.
  const handleUpdate = async () => {
    if (!task) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: task.status,
          assignedTo: selectedUsers,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      alert("Task updated successfully!");
      router.push("/dashboard"); // Navigate back to dashboard
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Error updating task.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>

      {/* Title Field */}
      <label className="block text-gray-600 font-semibold mb-2">Title:</label>
      <input
        type="text"
        className="border px-3 py-2 rounded-md w-full"
        value={task?.title}
        onChange={(e) =>
          task && setTask({ ...task, title: e.target.value })
        }
      />

      {/* Description Field */}
      <label className="block text-gray-600 font-semibold mt-4 mb-2">
        Description:
      </label>
      <textarea
        className="border px-3 py-2 rounded-md w-full"
        value={task?.description}
        onChange={(e) =>
          task && setTask({ ...task, description: e.target.value })
        }
      />

      {/* Status Dropdown */}
      <label className="block text-gray-600 font-semibold mt-4 mb-2">
        Status:
      </label>
      <select
        className="border px-3 py-2 rounded-md w-full"
        value={task?.status}
        onChange={(e) =>
          task && setTask({ ...task, status: e.target.value })
        }
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Drop-down for Assign Users */}
      <label className="block text-gray-600 font-semibold mt-4 mb-2">
        Assign Users:
      </label>
      <select
        className="border px-3 py-2 rounded-md w-full"
        onChange={handleSelectUser}
        defaultValue=""
      >
        <option value="" disabled>
          Select a user
        </option>
        {availableUsers.map((user) => (
          <option key={user.username} value={user.username}>
            {user.username}
          </option>
        ))}
      </select>

      {/* Reflect Selected Users with an Undo Option */}
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-700">Assigned To:</p>
        {selectedUsers.length === 0 ? (
          <p className="text-sm text-gray-600">No users assigned yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {selectedUsers.map((username) => (
              <li key={username} className="flex items-center space-x-2">
                <span>{username}</span>
                <button
                  className="text-red-500 underline text-xs"
                  onClick={() => handleRemoveUser(username)}
                >
                  Undo
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Save Changes Button */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700"
        onClick={handleUpdate}
      >
        Save Changes
      </button>
    </div>
  );
}