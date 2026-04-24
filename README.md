# 📊 User Activity & Audit Log Microservice

> A standalone, production-ready microservice for tracking user actions across multiple applications — built for FlexBusiness.

**Stack:** Node.js v18+ · Express v4 · React v19 · MySQL v8 · Docker 

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Default Login](#-default-login)
- [API Reference](#-api-reference)
- [Example Requests](#-example-requests)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Docker](#-docker)
- [Project Status](#-project-status)
- [Naming Convention](#-naming-convention)

---

## 🧩 Overview

This microservice solves a critical need for multi-user platforms — knowing **who did what, and when**. It provides:

- 📥 **Ingest API** — receives activity events from any application via REST
- 📊 **Dashboard UI** — a web interface to browse, filter, and search audit logs

Any FlexBusiness product (FlexDok, Webhook, future apps) can plug into this system with a single API key.

---

## 🏗 Architecture

```
┌─────────────────┐   POST /api/events    ┌──────────────────────┐
│   FlexDok       │ ───────────────────▶  │                      │
│   (any app)     │   (x-api-key auth)    │  User Activity       │
└─────────────────┘                       │  Microservice        │
                                          │                      │
┌─────────────────┐   GET /api/events     │  ┌──────────────┐   │
│  Dashboard UI   │ ◀─────────────────── │  │  Express API │   │
│  (React)        │   (JWT auth)          │  └──────┬───────┘   │
└─────────────────┘                       │         │            │
                                          │  ┌──────▼───────┐   │
                                          │  │    MySQL      │   │
                                          │  └──────────────┘   │
                                          └──────────────────────┘
```

---

## ⚡ Quick Start

### 1. Clone the project

```bash
git clone https://github.com/ismailchaouki1/user-activity.git
cd user-activity
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit your `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=user_activity
JWT_SECRET=your-secret-key
```

### 3. Database Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p user_activity < database/seed.sql
```

> 💡 The seed file includes **500+ demo events** for testing.

### 4. Start Backend

```bash
npm run dev
```

### 5. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🔑 Default Login

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `Admin123!` |

---

## 📡 API Reference

### 🔐 Auth

| Method | Endpoint          | Auth | Description   |
|--------|-------------------|------|---------------|
| POST   | `/api/auth/login` | —    | Get JWT token |

### 📥 Events

| Method | Endpoint          | Auth    | Description     |
|--------|-------------------|---------|-----------------|
| POST   | `/api/events`     | API Key | Log a new event |
| GET    | `/api/events`     | JWT     | List events     |
| GET    | `/api/events/:id` | JWT     | Event detail    |

**Query parameters for `GET /api/events`:**

| Parameter       | Type   | Description                                  |
|-----------------|--------|----------------------------------------------|
| `app_id`        | string | Filter by application                        |
| `user_id`       | string | Filter by user                               |
| `user_email`    | string | Filter by email (partial match)              |
| `action`        | string | Filter by action type                        |
| `resource_type` | string | Filter by resource type                      |
| `from`          | date   | Start date (ISO 8601)                        |
| `to`            | date   | End date (ISO 8601)                          |
| `page`          | number | Page number (default: `1`)                   |
| `limit`         | number | Results per page (default: `50`, max: `100`) |

**Response format:**

```json
{
  "data": [ "...events" ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 342,
    "totalPages": 7
  }
}
```

### 📦 Apps

| Method | Endpoint        | Auth | Description |
|--------|-----------------|------|-------------|
| POST   | `/api/apps`     | JWT  | Create app  |
| GET    | `/api/apps`     | JWT  | List apps   |
| DELETE | `/api/apps/:id` | JWT  | Delete app  |

### 📊 Dashboard

| Method | Endpoint     | Auth | Description          |
|--------|--------------|------|----------------------|
| GET    | `/api/stats` | JWT  | Dashboard statistics |
| GET    | `/health`    | —    | Health check         |

---

## 🧪 Example Requests

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Register App

```bash
curl -X POST http://localhost:5000/api/apps \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"flexdok","name":"FlexDok"}'
```

### Send Event

```bash
curl -X POST http://localhost:5000/api/events \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "flexdok",
    "user_id": "user123",
    "user_email": "john@example.com",
    "action": "document.edit",
    "resource_type": "document",
    "resource_id": "doc_456",
    "metadata": {
      "document_title": "Invoice Q1",
      "changes": ["title", "content"]
    }
  }'
```

---

## 🗄️ Database Schema

### `apps`

| Column         | Type         | Description          |
|----------------|--------------|----------------------|
| `id`           | VARCHAR(50)  | App ID (primary key) |
| `name`         | VARCHAR(100) | App name             |
| `description`  | VARCHAR(255) | Optional description |
| `api_key_hash` | VARCHAR(255) | bcrypt hashed key    |
| `is_active`    | BOOLEAN      | Active status        |
| `created_at`   | TIMESTAMP    | Creation time        |

### `events`

| Column          | Type         | Description           |
|-----------------|--------------|-----------------------|
| `id`            | BIGINT       | Auto-increment PK     |
| `app_id`        | VARCHAR(50)  | App reference (FK)    |
| `user_id`       | VARCHAR(100) | User identifier       |
| `user_email`    | VARCHAR(255) | User email            |
| `action`        | VARCHAR(100) | e.g. `document.edit`  |
| `resource_type` | VARCHAR(50)  | Resource type         |
| `resource_id`   | VARCHAR(100) | Resource identifier   |
| `metadata`      | JSON         | Extra freeform data   |
| `ip_address`    | VARCHAR(45)  | Client IP             |
| `user_agent`    | VARCHAR(500) | Browser agent         |
| `created_at`    | TIMESTAMP    | Event timestamp       |

### `admins`

| Column          | Type         | Description       |
|-----------------|--------------|-------------------|
| `id`            | INT          | Auto-increment PK |
| `username`      | VARCHAR(50)  | Unique username   |
| `email`         | VARCHAR(255) | Unique email      |
| `password_hash` | VARCHAR(255) | bcrypt hash       |
| `is_active`     | BOOLEAN      | Active status     |
| `created_at`    | TIMESTAMP    | Creation time     |

---

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

---

## 📁 Project Structure

```
user-activity/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MySQL connection pool
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   ├── apiKeyAuth.js       # API key verification
│   │   │   └── validate.js         # Input validation
│   │   ├── routes/
│   │   │   ├── events.js           # POST & GET /api/events
│   │   │   ├── apps.js             # CRUD /api/apps
│   │   │   ├── auth.js             # POST /api/auth/login
│   │   │   └── stats.js            # GET /api/stats
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   ├── App.js
│   │   │   └── Admin.js
│   │   └── app.js                  # Express app setup
│   ├── database/
│   │   ├── schema.sql              # Full schema
│   │   └── seed.sql                # 500+ sample events
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── ActivityChart.jsx
│   │   │   ├── Portal.jsx
│   │   │   ├── AppSettingModal.jsx
│   │   │   └── StatsCards.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   └── AppsPage.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios instance + API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

---

## 📊 Project Status

| Week | Deliverable        | Status |
|------|--------------------|--------|
| 1    | Backend Foundation | ✅     |
| 2    | Backend Complete   | ✅     |
| 3    | Frontend Complete  | ✅     |
| 4    | Production Ready   | ✅     |

---

## 🧠 Naming Convention

Actions follow a `resource.verb` format:

```
user.login          user.logout
user.create         user.update         user.delete
document.create     document.edit
document.delete     document.share
settings.update
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

> Built by [Chaouki Ismail](https://github.com/ismailchaouki1) — FlexBusiness Internship Project
