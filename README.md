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
bash
cd backend
npm install
cp .env.example .env
Edit .env:

env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=user_activity
JWT_SECRET=your-secret-key
3. Database Setup
bash
mysql -u root -p < database/schema.sql
mysql -u root -p user_activity < database/seed.sql   # 500+ demo events
4. Start Backend
bash
npm run dev
5. Frontend Setup
bash
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
POST	/api/events	API Key	Log an event
GET	/api/events	JWT	Query events
GET	/api/events/:id	JWT	Get event details
📦 Apps
Method	Endpoint	Auth	Description
POST	/api/apps	JWT	Register new app
GET	/api/apps	JWT	List all apps
DELETE	/api/apps/:id	JWT	Remove an app
📊 Dashboard
Method	Endpoint	Description
GET	/api/stats	Dashboard statistics
GET	/health	Health check
🧪 Example Request
Login
bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
Register an App
bash
curl -X POST http://localhost:5000/api/apps \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"flexdok","name":"FlexDok"}'
Send an Event
bash
curl -X POST http://localhost:5000/api/events \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"app_id":"flexdok","user_id":"user123","action":"document.edit"}'
🗄️ Database Schema (Simplified)
Apps Table
Column	Type	Description
id	VARCHAR(50)	App identifier
name	VARCHAR(100)	App name
api_key_hash	VARCHAR(255)	bcrypt hash
is_active	BOOLEAN	Status
created_at	TIMESTAMP	Creation date
Events Table
Column	Type	Description
id	BIGINT	Event ID
app_id	VARCHAR(50)	App reference
user_id	VARCHAR(100)	User identifier
action	VARCHAR(100)	Action type
metadata	JSON	Additional data
created_at	TIMESTAMP	Event time
🐳 Docker
bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
📁 Project Structure
text
user-activity/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/    # Database config
│   │   ├── middleware/# Auth, validation
│   │   ├── models/    # Admin, App, Event
│   │   ├── routes/    # API endpoints
│   │   └── app.js
│   ├── database/      # Schema + seed (500+ events)
│   └── package.json
├── frontend/          # React + Vite Dashboard
│   ├── src/
│   │   ├── components/# Layout, Charts
│   │   ├── pages/     # Login, Dashboard, Events, Apps
│   │   ├── context/   # Auth, Theme
│   │   ├── services/  # API client
│   │   └── index.css
│   └── package.json
└── README.md
📊 Project Status
Week	Deliverables	Status
Week 1	Backend Foundation (API, DB, Models, Auth)	✅
Week 2	Backend Complete + Frontend Start	✅
Week 3	Frontend Complete (Events, Filters, Apps)	✅
Week 4	Production Ready (Seed, Tests, Docker, Docs)	✅
🧠 Naming Convention
Use resource.action format:

text
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
💼 Why This Project Matters
This project demonstrates:

Skill	Evidence
Scalable Backend Architecture	Express.js + MySQL with proper indexing
Secure API Design	JWT authentication, bcrypt hashing, API key management
Real-world Logging System	Used in SaaS for security audit trails
Full-stack Development	React + Node.js with REST API integration
Production Ready	Docker, seeding script, edge case testing
Clean Code	MVC pattern, middleware separation, consistent naming
Perfect for: Portfolio, Freelance clients, Job applications (Full Stack / Backend roles)

📄 License
MIT © Ismail Chaouki

🔥 Screenshots
Add your screenshots here for better visual appeal

Dashboard: /screenshots/dashboard.png

Activity Feed: /screenshots/events.png

Apps Management: /screenshots/apps.png

🌍 Live Demo (Optional)
Deploy this project to showcase live:

Frontend: Vercel / Netlify / Render

Backend: Railway / Render / Fly.io

⭐ Star this repo if you find it useful!
text

This README is:
- ✅ GitHub preview friendly
- ✅ Clean and well-structured
- ✅ Includes all your improvements
- ✅ Has emojis for visual appeal
- ✅ Tables for API documentation
- ✅ Code blocks for commands
- ✅ Project structure with icons
- ✅ Status table
- ✅ "Why it matters" section for job applications
- ✅ Placeholder for screenshots
