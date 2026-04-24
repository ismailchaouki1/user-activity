# 📊 User Activity & Audit Log Microservice

A standalone, production-ready microservice for tracking user actions across multiple applications.

![Node](https://img.shields.io/badge/node-v18+-green)
![Express](https://img.shields.io/badge/express-v4-blue)
![React](https://img.shields.io/badge/react-v18-blue)
![MySQL](https://img.shields.io/badge/mysql-v8-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ⚡ Quick Start

### 1. Clone the project

```bash
git clone https://github.com/ismailchaouki1/user-activity.git
cd user-activity
2. Backend Setup
cd backend
npm install
cp .env.example .env

Edit .env:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=user_activity
JWT_SECRET=your-secret-key
3. Database Setup
mysql -u root -p < database/schema.sql
mysql -u root -p user_activity < database/seed.sql

Includes 500+ demo events

4. Start Backend
npm run dev
5. Frontend Setup
cd ../frontend
npm install
cp .env.example .env
npm run dev
🔑 Default Login
Field	Value
Username	admin
Password	admin123
📡 API Overview
🔐 Auth
Method	Endpoint	Description
POST	/api/auth/login	Get JWT token
📥 Events
Method	Endpoint	Auth	Description
POST	/api/events	API Key	Log event
GET	/api/events	JWT	List events
GET	/api/events/:id	JWT	Event detail
📦 Apps
Method	Endpoint	Auth	Description
POST	/api/apps	JWT	Create app
GET	/api/apps	JWT	List apps
DELETE	/api/apps/:id	JWT	Delete app
📊 Dashboard
Method	Endpoint	Description
GET	/api/stats	Dashboard statistics
GET	/health	Health check
🧪 Example Requests
Login
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"admin","password":"admin123"}'
Register App
curl -X POST http://localhost:5000/api/apps \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"id":"flexdok","name":"FlexDok"}'
Send Event
curl -X POST http://localhost:5000/api/events \
-H "x-api-key: YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{"app_id":"flexdok","user_id":"user123","action":"document.edit"}'
🗄️ Database Schema
Apps
Column	Type	Description
id	VARCHAR(50)	App ID
name	VARCHAR(100)	App name
api_key_hash	VARCHAR(255)	Hashed key
is_active	BOOLEAN	Status
created_at	TIMESTAMP	Created at
Events
Column	Type	Description
id	BIGINT	Event ID
app_id	VARCHAR(50)	App reference
user_id	VARCHAR(100)	User ID
action	VARCHAR(100)	Action
metadata	JSON	Extra data
created_at	TIMESTAMP	Timestamp
🐳 Docker
docker-compose up -d
docker-compose down
docker-compose logs -f
📁 Project Structure
user-activity/
├── backend/
│   ├── src/
│   ├── database/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
📊 Project Status
Week	Deliverable	Status
1	Backend Foundation	✅
2	Backend Complete	✅
3	Frontend Complete	✅
4	Production Ready	✅
🧠 Naming Convention
user.login
user.logout
user.create
user.update
user.delete
document.create
document.edit
document.delete
document.share
settings.update
