import React from 'react';
import TaskItem from './TaskItem';

/**
 * TaskList Component
 * 
 * Renders the collection of tasks or an empty state message if no tasks exist.
 */
const TaskList = ({ tasks, onToggleComplete, onDeleteTask, onUpdateTitle, filter }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>
          {filter === 'completed'
            ? 'No tasks completed yet. Keep going!'
            : filter === 'active'
            ? 'No pending tasks. You are all caught up!'
            : 'Add your first task above to get started.'}
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onUpdateTitle={onUpdateTitle}
        />
      ))}
    </ul>
  );
};

export default TaskList;
