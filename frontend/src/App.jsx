import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

// Base URL for the backend REST API
const API_BASE_URL = 'http://localhost:5000/api/tasks';

/**
 * Main App Component
 * 
 * Manages the core state for tasks, loads data on initial render,
 * and coordinates all asynchronous REST API operations.
 */
function App() {
  // B2: Keep tasks in component state with useState
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  /**
   * B2 & B6: Fetch all tasks from the backend on page load using useEffect.
   * Calls GET /api/tasks and updates state without full page reload.
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setErrorMessage('Could not connect to the backend server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Run fetchTasks once when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * B3 & B6: Add a new task by calling POST /api/tasks.
   * On success, prepends the new task to the tasks state and returns true to clear the form input.
   * 
   * @param {string} title - The trimmed task title
   * @returns {Promise<boolean>} - Success indicator for the caller
   */
  const handleAddTask = async (title) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // A5 & B3: POST request with JSON payload containing converted and trimmed title
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: String(title).trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error adding task (${response.status})`);
      }

      const newTask = await response.json();

      // B6: Update state directly without reloading the page
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      return true;
    } catch (err) {
      console.error('Add task error:', err);
      setErrorMessage(err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * B4 & B6: Mark task complete or incomplete by calling PUT /api/tasks/:id.
   * Updates state immediately upon successful response.
   * 
   * @param {string} id - The task ID
   * @param {boolean} nextCompleted - The updated completion status
   */
  const handleToggleComplete = async (id, nextCompleted) => {
    try {
      setErrorMessage(null);

      // Call PUT endpoint with updated completion status
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error updating task (${response.status})`);
      }

      const updatedTask = await response.json();

      // B6: Update state in-place without page reload
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (err) {
      console.error('Toggle complete error:', err);
      setErrorMessage(err.message);
    }
  };

  /**
   * Update task title using PUT /api/tasks/:id.
   * 
   * @param {string} id - The task ID
   * @param {string} newTitle - The updated task title
   * @returns {Promise<boolean>} - Success indicator
   */
  const handleUpdateTitle = async (id, newTitle) => {
    try {
      setErrorMessage(null);

      // A5 & A4: Call PUT endpoint with trimmed title string
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: String(newTitle).trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error updating title (${response.status})`);
      }

      const updatedTask = await response.json();

      // Update state without page reload
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
      return true;
    } catch (err) {
      console.error('Update title error:', err);
      setErrorMessage(err.message);
      return false;
    }
  };

  /**
   * B5 & B6: Delete task by calling DELETE /api/tasks/:id.
   * Removes task from React state without page reload.
   * 
   * @param {string} id - The task ID to remove
   */
  const handleDeleteTask = async (id) => {
    try {
      setErrorMessage(null);

      // Call DELETE endpoint
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error deleting task (${response.status})`);
      }

      // B6: Filter out deleted task from React state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Delete task error:', err);
      setErrorMessage(err.message);
    }
  };

  // Filter tasks based on selected filter tab
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      {/* Header with Project and Student Information */}
      <header className="app-header">
        <div className="header-badge">23CSB40B • Web Technology • S7 CSE</div>
        <h1 className="app-title">MERN Stack To-Do List</h1>
        <p className="app-subtitle">
          Student: <strong>Jaine S Thomas</strong> (Roll No: <strong>B23CS1136</strong>)
        </p>
      </header>

      {/* Main card */}
      <main className="app-card">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="alert alert-error">
            <span>⚠️ {errorMessage}</span>
            <button className="btn-close" onClick={() => setErrorMessage(null)}>×</button>
          </div>
        )}

        {/* B3: Task input form */}
        <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

        {/* Stats and filter bar */}
        <div className="controls-bar">
          <div className="stats-info">
            <span className="stats-pill">
              Total: <strong>{totalCount}</strong>
            </span>
            <span className="stats-pill completed-pill">
              Completed: <strong>{completedCount}</strong> / {totalCount}
            </span>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Loading state or Task List */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading tasks from database...</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onUpdateTitle={handleUpdateTitle}
            filter={filter}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with MongoDB, Express.js, React.js & Node.js</p>
      </footer>
    </div>
  );
}

export default App;
