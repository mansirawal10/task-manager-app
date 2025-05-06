import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, searchTasks, assignTask, getFilteredTasks } from '../controllers/taskController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isManager } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Protect all routes with authentication
router.use(verifyToken);

// Task CRUD Routes
router.post('/', createTask); // Create task
router.get('/', getTasks); // Get all tasks (with pagination, sorting, filtering)

// Task Assignment & Filtering (Static routes should come BEFORE dynamic ones)
router.post('/assign', isManager, assignTask); // Only managers can assign tasks
router.get('/filtered', getFilteredTasks);    // Get filtered tasks
router.get('/search', searchTasks);           // Search tasks

// Dynamic Task Routes (should come last)
router.get('/:taskId', getTaskById); // Get a single task by ID
router.get('/:taskId', verifyToken, getTaskById);
router.put('/:taskId', updateTask);  // Update task
router.delete('/:taskId', deleteTask); // Delete task


export default router;