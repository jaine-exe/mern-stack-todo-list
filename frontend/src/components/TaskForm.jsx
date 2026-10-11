import React, { useState } from 'react';

/**
 * TaskForm Component
 * 
 * B3: Provides a form to add a new task.
 * On submit:
 * - Trims input
 * - Sends task title to parent handler (which calls the POST endpoint)
 * - Clears input field upon success
 */
const TaskForm = ({ onAddTask, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = String(title).trim();

    // Client-side validation: title cannot be empty
    if (!trimmedTitle) {
      setError('Please enter a task title');
      return;
    }

    setError('');
    const success = await onAddTask(trimmedTitle);
    if (success) {
      setTitle(''); // Clear input after successful creation
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className={`task-input ${error ? 'input-error' : ''}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default TaskForm;
