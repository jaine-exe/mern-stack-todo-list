# MERN Stack To-Do List Application

A full-stack To-Do List web application built using the **MERN** stack (**M**ongoDB, **E**xpress.js, **R**eact.js, and **N**ode.js). The frontend, backend, and database are connected and communicate via a RESTful API. The project is managed with Git and GitHub using feature branches and Pull Requests.

## Student Details
- **Name**: Jaine S Thomas
- **Roll Number**: B23CS1136
- **Course**: 23CSB40B — Web Technology (S7 CSE)
- **Institution**: Mar Baselios College of Engineering and Technology (MBCET), Thiruvananthapuram

## Features
- **Full CRUD Operations**:
  - `GET /api/tasks` — Fetch all tasks from MongoDB
  - `POST /api/tasks` — Create new task with validation
  - `PUT /api/tasks/:id` — Update task status (complete/incomplete) and title
  - `DELETE /api/tasks/:id` — Remove task from database
- **Input Validation**: Strips whitespace and rejects empty titles with `400 Bad Request`.
- **CORS Protection**: Restricted to frontend origin (`http://localhost:3000`).
- **Responsive UI**: Built with React (Vite) featuring component separation (`TaskForm`, `TaskList`, `TaskItem`), real-time state updates without page reload, and clear visual indicators for completed tasks.
- **Git Branching Workflow**: Developed using `feature/backend` and `feature/frontend` branches integrated into `main` via merged Pull Requests.
