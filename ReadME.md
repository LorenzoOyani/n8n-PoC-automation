# Node.js + PostgreSQL + n8n Automation API

This project is a **Node.js backend** that connects to a **PostgreSQL database** and triggers **n8n workflows**.  
It is fully containerized using **Docker Compose**, allowing you to run Node.js, Postgres, and n8n together with a single command.

All services now run successfully after applying several stability fixes, and all API endpoints respond correctly.

---

##  Fixes & Improvements Implemented

The original setup had issues such as container restart loops and repeated database initialization.  
These issues have now been fully resolved.

###  Removal of Restart Loop  
- Removed `npm run setup-db` from the Docker startup command  
- DB initialization is now run **only once manually** when needed  
- Prevented database setup from running endlessly on every container restart

### ✔ Correct Webhook Variable  
- Replaced incorrect `N8N_URL` with correct `N8N_WEBHOOK_URL`  
- Now correctly matches `process.env.N8N_WEBHOOK_URL` in the Node.js code

### ✔ Docker-Safe Express Server Binding  
- Server now listens on:  
  ```js
  app.listen(PORT, '0.0.0.0');
  
### All API Endpoints Verified Working

- /health

- /api/get-wallet-balance

- /api/trigger-wallet-email

📦 Tech Stack

- Node.js 18 (Alpine)

- Express.js

- PostgreSQL 14

- n8n Workflow Automation

- Axios

- CORS

- Docker & Docker Compose

📁 Project Structure
├── Dockerfile
├── docker-compose.yml
├── package.json
├── api/
│   ├── server.js
│   └── setup/
│       └── database.js
├── .env
└── README.md

🚀 Setup & Run
1. Clone the repository
- git clone <repo-url>
- cd <repo-folder>

2. Build & run all services
- docker-compose up --build

3. Stop all services
- docker-compose down

⚙️ Environment Variables
Node App Variables (set in docker-compose)

| Variable          | Description                    | Example                                      |
| ----------------- | ------------------------------ | -------------------------------------------- |
| `DB_HOST`         | Postgres host (container name) | `postgres`                                   |
| `DB_PORT`         | Postgres port                  | `5432`                                       |
| `DB_NAME`         | Database name                  | `n8n_automation_table`                       |
| `DB_USER`         | Database user                  | `postgres`                                   |
| `DB_PASSWORD`     | Database password              | `Admin`                                      |
| `PORT`            | Node.js server port            | `3000`                                       |
| `N8N_WEBHOOK_URL` | Full n8n webhook URL           | `http://n8n:5678/webhook/your-workflow-path` |


n8n Environment Variables

| Variable                  | Description           | Example            |
| ------------------------- | --------------------- | ------------------ |
| `N8N_BASIC_AUTH_USER`     | Basic auth username   | `admin`            |
| `N8N_BASIC_AUTH_PASSWORD` | Basic auth password   | `admin123`         |
| `WEBHOOK_URL`             | Internal n8n base URL | `http://n8n:5678/` |

🧪 API Endpoints
🔹 GET /health

{
  "status": "healthy",
  "timeStamp": "2025-11-13T12:00:00.000Z"
}

🔹 GET /api/get-wallet-balance?id=1

Fetches wallet balance for a subscriber.

Example response:

{
  "walletBalance": 100.00,
  "subscriber_id": "1"
}

🔹 POST /api/trigger-wallet-email

Triggers the connected n8n workflow.

Request Body:

{
  "subscriberId": 1
}
Response:
{
  "success": true,
  "message": "Workflow triggered successfully",
  "subscriber": {
    "id": 1,
    "email": "example@mail.com",
    "name": "John"
  },
  "n8n_response": { ... }
}

🗄️ Database Information

- Table: subscribers

- Columns: id, email, first_name, last_name, wallet_balance, timestamps

- Sample rows auto-inserted by the database setup script

Run DB setup manually (when needed)
- docker-compose run --rm nodeapp npm run setup-db

### Graceful Shutdown

The Node server handles SIGTERM, ensuring PostgreSQL connections close cleanly before shutting down.


