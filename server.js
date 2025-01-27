// const express = require('express');
// const fs = require('fs').promises;
// const path = require('path');
// const cors = require('cors');
// const { v4: uuidv4 } = require('uuid');

// const app = express();
// const PORT = 3000;
// const DATA_FILE = path.join(__dirname, 'tasks.json');

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Ensure data file exists
// async function initializeDataFile() {
//     try {
//         await fs.access(DATA_FILE);
//     } catch {
//         await fs.writeFile(DATA_FILE, JSON.stringify([]));
//     }
// }

// // Read tasks
// async function readTasks() {
//     try {
//         const data = await fs.readFile(DATA_FILE, 'utf8');
//         return JSON.parse(data);
//     } catch (error) {
//         console.error('Error reading tasks:', error);
//         return [];
//     }
// }

// // Write tasks
// async function writeTasks(tasks) {
//     try {
//         await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
//     } catch (error) {
//         console.error('Error writing tasks:', error);
//         throw new Error('Failed to save tasks');
//     }
// }

// // Get all tasks
// app.get('/api/tasks', async (req, res) => {
//     try {
//         const tasks = await readTasks();
//         res.json(tasks);
//     } catch (error) {
//         console.error('Error fetching tasks:', error);
//         res.status(500).json({ error: 'Failed to fetch tasks' });
//     }
// });

// // Add task
// app.post('/api/tasks', async (req, res) => {
//     try {
//         const { text } = req.body;
        
//         if (!text || !text.trim()) {
//             return res.status(400).json({ error: 'Task text is required' });
//         }

//         const newTask = {
//             id: uuidv4(),
//             text: text.trim(),
//             completed: false,
//             createdAt: new Date().toISOString()
//         };

//         const tasks = await readTasks();
//         tasks.push(newTask);
//         await writeTasks(tasks);
//         res.status(201).json(newTask);
//     } catch (error) {
//         console.error('Error creating task:', error);
//         res.status(500).json({ error: 'Failed to create task' });
//     }
// });

// // Update task
// app.put('/api/tasks/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { completed } = req.body;

//         if (!id) {
//             return res.status(400).json({ error: 'Task ID is required' });
//         }

//         const tasks = await readTasks();
//         const taskIndex = tasks.findIndex(task => task.id === id);

//         if (taskIndex === -1) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         const updatedTask = {
//             ...tasks[taskIndex],
//             completed,
//             updatedAt: new Date().toISOString()
//         };

//         tasks[taskIndex] = updatedTask;
//         await writeTasks(tasks);
//         res.json(updatedTask);
//     } catch (error) {
//         console.error('Error updating task:', error);
//         res.status(500).json({ error: 'Failed to update task' });
//     }
// });

// // Delete task
// app.delete('/api/tasks/:id', async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).json({ error: 'Task ID is required' });
//         }

//         const tasks = await readTasks();
//         const filteredTasks = tasks.filter(task => task.id !== id);

//         if (tasks.length === filteredTasks.length) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         await writeTasks(filteredTasks);
//         res.status(200).json({ message: 'Task deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting task:', error);
//         res.status(500).json({ error: 'Failed to delete task' });
//     }
// });

// // Start server
// async function startServer() {
//     await initializeDataFile();
//     app.listen(PORT, () => {
//         console.log(`Server running on http://localhost:${PORT}`);
//     });
// }

// startServer().catch(console.error);