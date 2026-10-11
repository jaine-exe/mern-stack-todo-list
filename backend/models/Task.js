const mongoose = require('mongoose');

/**
 * Task Mongoose Schema
 * Fields:
 *  - title: String, required
 *  - completed: Boolean, default false
 *  - createdAt: Date, default now
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
