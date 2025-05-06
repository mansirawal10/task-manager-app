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

  const [users, setUsers] = useState<{ _id: string; username: string }[]>([]); // Store user IDs and usernames
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  // Fetch usernames dynamically
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("${NEXT_PUBLIC_API_URL}/api/users");
      const data = await response.json();
      console.log("Fetched Users:", data);
      setUsers(data.users); // Store list of usernames
    };
    fetchUsers();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!taskData.title || !taskData.assignedTo || !token) {
      console.error("Missing required fields or token");
      return;
    }
  
    const formattedTaskData = {
      ...taskData,
      assignedTo: taskData.assignedTo, // Don't join; send as an array
    };
  
    try {
      const response = await fetch("${NEXT_PUBLIC_API_URL}/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedTaskData),
      });
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to create task:", errText);
        throw new Error("Task creation failed");
      }
  
      console.log("Task created successfully.");
      router.push("/dashboard"); // Redirect after successful creation
    } catch (err) {
      console.error("Task creation failed:", err);
    }
  };
  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Create a New Task</h1>
      <form onSubmit={handleCreateTask}>
        <input type="text" placeholder="Title" className="w-full p-2 border rounded-md mb-4"
          value={taskData.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} />
        <textarea placeholder="Description" className="w-full p-2 border rounded-md mb-4"
          value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}></textarea>

        <select className="w-full p-2 border rounded-md mb-4"
          value={taskData.priority} onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input type="date" className="w-full p-2 border rounded-md mb-4"
          value={taskData.dueDate} onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })} />

        {/* User Dropdown (Assign Task) */}
        <select className="w-full p-2 border rounded-md mb-4"
          value={taskData.assignedTo} onChange={(e) => setTaskData({ ...taskData, assignedTo: [...taskData.assignedTo, e.target.value]})}>
          <option value="">Select a User</option>
          {users.map((user) => (
            <option key={user._id} value={user.username}>{user.username}</option> // ✅ Ensure correct key and value
          ))}
        </select>


        <select className="w-full p-2 border rounded-md mb-4"
          value={taskData.status} onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-end space-x-4">
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={() => router.push("/dashboard")}>
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}