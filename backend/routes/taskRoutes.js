const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const router = express.Router();

/**
 * @route   GET /api/tasks
 * @desc    Fetch all tasks from the database
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Retrieve all tasks sorted by creation date (newest first)
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Add a new task
 * @access  Public
 * @note    A5: convert title with String(), trim it, and reject empty title with 400
 */
router.post('/', async (req, res) => {
  try {
    // Validate title presence
    if (req.body.title === undefined || req.body.title === null) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // A5: Convert with String() and trim whitespace
    const trimmedTitle = String(req.body.title).trim();

    // A5: Reject empty title with 400 status
    if (trimmedTitle.length === 0) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    const newTask = new Task({
      title: trimmedTitle,
      completed: req.body.completed ? Boolean(req.body.completed) : false,
    });

    const savedTask = await newTask.save();
    // Return 201 Created with newly created task
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Server error while creating task' });
  }
});

module.exports = router;
