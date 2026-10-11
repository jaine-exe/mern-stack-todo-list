import React, { useState } from 'react';

/**
 * TaskItem Component
 * 
 * Displays an individual task item with:
 * - Checkbox to toggle completion status (B4: calls PUT endpoint)
 * - Visual difference for completed tasks (strike-through & opacity)
 * - Optional inline title editing (calls PUT endpoint)
 * - Delete button to remove task (B5: calls DELETE endpoint)
 * - Creation timestamp formatted for readability
 */
const TaskItem = ({ task, onToggleComplete, onDeleteTask, onUpdateTitle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editError, setEditError] = useState('');

  // Handle inline title update submission
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const trimmed = String(editTitle).trim();
    if (!trimmed) {
      setEditError('Title cannot be empty');
      return;
    }
    setEditError('');
    const success = await onUpdateTitle(task._id, trimmed);
    if (success) {
      setIsEditing(false);
    }
  };

  // Cancel title editing and revert back
  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditError('');
    setIsEditing(false);
  };

  // Format creation timestamp
  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        {/* B4: Checkbox to toggle complete/incomplete */}
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task._id, !task.completed)}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="checkmark"></span>
        </label>

        {/* Content area: Editing form or Title Display */}
        <div className="task-content">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="edit-form">
              <input
                type="text"
                className="edit-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />
              {editError && <span className="field-error">{editError}</span>}
              <div className="edit-actions">
                <button type="submit" className="btn btn-save" title="Save changes">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={handleCancelEdit}
                  title="Cancel editing"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="task-details">
              {/* B4: Show completed tasks differently (strike-through) */}
              <span className={`task-title ${task.completed ? 'strike' : ''}`}>
                {task.title}
              </span>
              <div className="task-meta">
                <span className="task-date">{formatDate(task.createdAt)}</span>
                {task.completed && <span className="badge-completed">Completed</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {!isEditing && (
        <div className="task-actions">
          {/* Edit button */}
          <button
            type="button"
            className="btn btn-icon btn-edit"
            onClick={() => {
              setEditTitle(task.title);
              setIsEditing(true);
            }}
            title="Edit task title"
            aria-label="Edit task"
          >
            ✏️
          </button>

          {/* B5: Delete button to remove task */}
          <button
            type="button"
            className="btn btn-icon btn-delete"
            onClick={() => onDeleteTask(task._id)}
            title="Delete task"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      )}
    </li>
  );
};

export default TaskItem;
