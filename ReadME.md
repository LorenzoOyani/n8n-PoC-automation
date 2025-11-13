# Node.js + PostgreSQL + n8n Automation API

This project is a **Node.js backend** application that connects to a **PostgreSQL database** and interacts with **n8n workflows**. The setup is fully containerized using **Docker Compose**, allowing you to start the Node.js app, Postgres, and n8n with a single command.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Run](#setup--run)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Docker Services](#docker-services)
- [Database](#database)
- [Graceful Shutdown](#graceful-shutdown)
- [Notes](#notes)

---

## Tech Stack

- **Node.js 18** (Alpine)
- **Express.js**
- **PostgreSQL 14**
- **n8n** (Workflow automation)
- **Axios** for HTTP requests
- **CORS** for cross-origin requests
- **Docker & Docker Compose**

---

## Project Structure

├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.js
├── .env
└── README.md


- `Dockerfile` - defines Node.js image and dependencies  
- `docker-compose.yml` - orchestrates Node app, Postgres, and n8n  
- `server.js` - Node.js backend with API endpoints  
- `.env` - environment variables for DB, ports, n8n URL  

---

## Setup & Run

1. **Clone the repository:**

```bash
git clone <repo-url>
cd <repo-folder>

```

docker-compose up --build

Stop services

docker-compose down

Environment Variables
| Variable                  | Description                        | Example                |
| ------------------------- | ---------------------------------- | ---------------------- |
| `DB_HOST`                 | Postgres host                      | `postgres`             |
| `DB_PORT`                 | Postgres port                      | `5432`                 |
| `DB_NAME`                 | Database name                      | `n8n_automation_table` |
| `DB_USER`                 | Database user                      | `postgres`             |
| `DB_PASSWORD`             | Database password                  | `Admin`                |
| `PORT`                    | Node.js server port                | `3000`                 |
| `N8N_URL`                 | n8n internal URL for webhook calls | `http://n8n:5678/`     |
| `N8N_BASIC_AUTH_USER`     | n8n basic auth username            | `admin`                |
| `N8N_BASIC_AUTH_PASSWORD` | n8n basic auth password            | `admin123`             |


{
  "status": "healthy",
  "timeStamp": "2025-11-13T12:00:00.000Z"
}


