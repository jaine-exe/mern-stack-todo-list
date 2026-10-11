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

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task (mark complete/incomplete or edit the title)
 * @access  Public
 * @note    A5: convert title with String(), trim it, and reject empty title with 400
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updates = {};

    // A5: If title is provided, convert with String(), trim it, and reject empty title with 400
    if (req.body.title !== undefined) {
      const trimmedTitle = String(req.body.title).trim();
      if (trimmedTitle.length === 0) {
        return res.status(400).json({ error: 'Task title cannot be empty' });
      }
      updates.title = trimmedTitle;
    }

    // Handle completed boolean update
    if (req.body.completed !== undefined) {
      updates.completed = Boolean(req.body.completed);
    }

    // Verify at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Find and update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, returnDocument: 'after', runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error while updating task' });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Find and delete the task
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      task: deletedTask,
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error while deleting task' });
  }
});

module.exports = router;
