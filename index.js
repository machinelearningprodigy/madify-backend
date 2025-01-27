const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Path to the JSON file
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Helper function to read tasks from the JSON file
const readTasksFromFile = () => {
  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(tasksFilePath);
  return JSON.parse(data);
};

// Helper function to write tasks to the JSON file
const writeTasksToFile = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// API Endpoints

// Get all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = readTasksFromFile();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  try {
    const tasks = readTasksFromFile();
    const newTask = {
      id: Date.now(),
      text: req.body.text,
      completed: req.body.completed || false,
    };
    tasks.push(newTask);
    writeTasksToFile(tasks);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const tasks = readTasksFromFile();
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    writeTasksToFile(tasks);
    res.json(tasks[taskIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const tasks = readTasksFromFile();
    const taskId = parseInt(req.params.id, 10);
    const filteredTasks = tasks.filter((task) => task.id !== taskId);

    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    writeTasksToFile(filteredTasks);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
