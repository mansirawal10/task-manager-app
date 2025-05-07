'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateTaskPage() {
  const router = useRouter();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: [] as string[],
    status: "not-started",
  });

  const [users, setUsers] = useState<{ _id: string; username: string }[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  const availableUsers = users.filter(
    user => !taskData.assignedTo.includes(user.username)
  );

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskData.title || !taskData.assignedTo.length || !token) {
      console.error("Missing required fields or token");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Task creation failed");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Task creation failed:", err);
    }
  };



  const handleAddUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.value;
    if (username && !taskData.assignedTo.includes(username)) {
      setTaskData({
        ...taskData,
        assignedTo: [...taskData.assignedTo, username]
      });
      e.target.value = ""; // Reset the select dropdown
    }
  };

  const handleRemoveUser = (username: string) => {
    setTaskData({
      ...taskData,
      assignedTo: taskData.assignedTo.filter(user => user !== username)
    });
  };


  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Create a New Task</h1>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded-md mb-4"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded-md mb-4"
          value={taskData.description}
          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
        ></textarea>

        <select
          className="w-full p-2 border rounded-md mb-4"
          value={taskData.priority}
          onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          className="w-full p-2 border rounded-md mb-4"
          value={taskData.dueDate}
          onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
        />

        {/* Improved User Assignment */}
        <div className="mb-4">
          <label className="block mb-2">Assign to:</label>
          <select
            className="w-full p-2 border rounded-md mb-2"
            onChange={handleAddUser}
            defaultValue=""
          >
            <option value="" disabled>Select a User</option>
            {availableUsers.map((user) => (
              <option key={user._id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>


          <div className="flex flex-wrap gap-2 mt-2">
            {taskData.assignedTo.map((username) => (
              <div key={username} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <span>{username}</span>
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveUser(username)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        

        <select
          className="w-full p-2 border rounded-md mb-4"
          value={taskData.status}
          onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={!taskData.title || !taskData.assignedTo.length}
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}