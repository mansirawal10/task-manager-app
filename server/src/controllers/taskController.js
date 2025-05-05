// src/controllers/taskController.js
import express from "express";
import mongoose from "mongoose";
import Task from '../models/Task.js';  
import User from '../models/User.js';


// Create Task
export const createTask = async (req, res) => {
  try {
    console.log("Received Task Data:", req.body);
    console.log("User ID from Token:", req.userId); 
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    const existingUsers = await User.find({ username: { $in: assignedTo } });

    if (existingUsers.length !== assignedTo.length) {
      return res.status(400).json({ message: "Some usernames are invalid or do not exist." });
    }
    
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: req.userId, // The logged-in user who creates the task
      assignedTo
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    // Get query parameters for pagination, sorting, and filtering
    const { page = 1, limit = 10, status, priority, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;

    // Find the logged-in user (get username from userId)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct query object
    const query = {
      $or: [
        { assignedTo: user.username }, // ✅ Find tasks by username instead of ObjectId
        { createdBy: req.userId } // Keep createdBy as ObjectId since it's stored that way
      ]
    };

    // Add additional filters if provided
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Set sorting options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Query the database
    const tasks = await Task.find(query)
      .skip(skip)       // Skip tasks based on page
      .limit(limit)     // Limit the number of tasks per page
      .sort(sortOptions) // Sort tasks based on provided sorting criteria
      .populate("createdBy", "username email"); // ✅ Populate creator details only (assignedTo is already a string)

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    // ✅ Validate if `taskId` is a proper MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID format" });
    }

    // ✅ Find the task (which stores usernames in `assignedTo`)
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Prevent errors when `assignedTo` is empty or undefined
    if (!task.assignedTo || task.assignedTo.length === 0) {
      return res.status(200).json({ task, assignedUsers: [] });
    }

    // ✅ Fetch user details based on usernames instead of ObjectId
    const assignedUsers = await User.find({ username: { $in: task.assignedTo } }).select("username email");

    res.status(200).json({ task, assignedUsers });
  } catch (error) {
    console.error("❌ Error fetching task:", error);
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};
// Update Task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

export const assignTask = async (req, res) => {
    try {
      const { taskId, assignedTo } = req.body;
  
      // Find task and update assigned user
      const task = await Task.findById(taskId);
      task.assignedTo = assignedTo;
      await task.save();
      const userExists = await User.findOne({ username: assignedTo });
      if (!userExists) {
        return res.status(400).json({ message: "Invalid username. User does not exist." });
      };
  
      // Create notification for the assigned user
       const notifications = assignedTo.map(userId => ({
        userId,
        message: `You have been assigned a new task: ${task.title}`,
      }));
      await Notification.insertMany(notifications);
  
      res.status(200).json({ message: "Task assigned successfully", task });
    } catch (error) {
      res.status(500).json({ message: "Error assigning task", error: error.message });
    }
  };
  

  export const getFilteredTasks = async (req, res) => {
    try {
      const { title, status, priority, dueDate } = req.query;
      const filter = {};
  
      if (title) filter.title = { $regex: title, $options: 'i' };
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (dueDate) filter.dueDate = { $gte: new Date(dueDate) };
  
      // Note: Only populate fields that are ObjectIDs; since assignedTo is stored as strings, skip it.
      const tasks = await Task.find(filter).populate('createdBy', 'username email');
      res.status(200).json({ tasks });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error fetching filtered tasks', error: error.message });
    }
  };
  
  // Search tasks by title or description
export const searchTasks = async (req, res) => {
  try {
    const { query } = req.query; // Get the query parameter from the request

    // Search for tasks where title or description matches the query
    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: query, $options: 'i' } }
      ]
    }).populate('assignedTo createdBy', 'username email'); // Populate user details

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error searching tasks', error: error.message });
  }
};
