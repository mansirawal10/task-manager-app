import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/authRoutes.js';

import taskRoutes from './src/routes/taskRoutes.js';
import { getTaskById, updateTask } from './src/controllers/taskController.js';

dotenv.config();

const app = express(); // Ensure express is initialized only once

// Middleware
app.use(cors({
  origin:"https://task-manager-a5ityq0hv-mansis-projects-9ea07d16.vercel.app"
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// GET specific task by ID
app.get("/api/tasks/:taskId", getTaskById);

// PUT update a task
app.put("/api/tasks/:taskId", updateTask);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

// Start the server
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});