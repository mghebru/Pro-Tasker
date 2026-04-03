# Pro-Tasker

A simple task management app where users can create projects and manage tasks.

## Features

* User authentication (login & register)
* Create and manage projects
* Add, update, and delete tasks
* Track task status

## Tech Stack

* Frontend: React
* Backend: Node.js, Express
* Database: MongoDB

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/pro-tasker.git
```

2. Install dependencies

```bash
cd pro-tasker
npm install
```

3. Start the server

```bash
npm run dev
```

## API Routes

### Auth

* `POST /api/auth/register` → Register a new user
* `POST /api/auth/login` → Login user

### Projects

* `GET /api/projects` → Get all user projects
* `POST /api/projects` → Create a project
* `GET /api/projects/:id` → Get single project
* `PUT /api/projects/:id` → Update project
* `DELETE /api/projects/:id` → Delete project

### Tasks

* `GET /api/projects/:projectId/tasks` → Get all tasks for a project
* `POST /api/projects/:projectId/tasks` → Create a task
* `PUT /api/tasks/:id` → Update task
* `DELETE /api/tasks/:id` → Delete task

## Usage

* Register a new account
* Create a project
* Add tasks and track progress

## Deployment
**Backend:** https://pro-tasker-backend-za90.onrender.com/
**Frontend:** https://protaskerfrontend.netlify.app/login

## License

MIT
