# 🧠 CV Builder Microservices System (Event Sourcing + CQRS)

A modern CV creation and management system that applies **Event Sourcing** and **CQRS** architecture, allowing users to create, edit, and version-control their resumes in a block-based editor (inspired by Google Docs and TopCV).

---

## 👥 Team Members

- **Nguyen Van A** – Backend (Auth, CV Command)
- **Tran Thi B** – Frontend (React, Editor)
- **Le Van C** – Gateway, Projection, Docker

---

## ✅ Key Features

- [x] Register and login with JWT
- [x] Create new CVs with title and template
- [x] Add, update, and remove sections using a block-based editor
- [x] Undo the latest change
- [x] Replay CV state from the original event stream
- [x] Store all changes as immutable events
- [x] View a list of all created CVs by the user
- [x] Preview CV with template rendering
- [x] View full CV detail including all blocks
- [x] Fully decoupled microservices for command/query

---

## ⚙️ System Architecture

**Microservices** structure includes:

| Service       | Responsibility                          | Tech Stack         |
|---------------|------------------------------------------|--------------------|
| `auth`        | User authentication and JWT issuance     | NestJS + MongoDB   |
| `user`        | User profile management                  | NestJS + MongoDB   |
| `cv-command`  | Append-only event storage (CV actions)   | NestJS + MongoDB   |
| `cv-query`    | Read model projection from events        | NestJS + MongoDB   |
| `gateway`     | API Gateway routing frontend calls       | NestJS + Axios     |
| `frontend`    | Block-based resume editor and UI         | React + Vite       |

---

## 🔁 Data Flow (CQRS + Event Sourcing)

1. User sends API request to `gateway`
2. `cv-command` emits events and stores them in MongoDB
3. `cv-command` pushes events to `cv-query` via internal REST call
4. `cv-query` updates the projection (read model)
5. `frontend` fetches final data from `cv-query` through read APIs

---

## 🧱 Architecture Diagram

\`\`\`txt
               +------------+
               |  Frontend  |
               |  (React)   |
               +-----+------+
                     |
                     v
              +-------------+
              |  Gateway    |
              |  (NestJS)   |
              +--+---+---+--+
                 |   |   |
                 v   v   v
         +-------+ +-----+ +----------+
         | Auth  | | User| | CV-Command|
         +-------+ +-----+ +----------+
                                  |
                            [Events MongoDB]
                                  |
                                  v
                          +----------------+
                          |   CV-Query     |
                          |  (Projection)  |
                          +----------------+
\`\`\`

---

## 🚀 Getting Started

\`\`\`bash
# Clone the repository
git clone <repo>

# Run all services
docker-compose up --build

# Default ports:
# - Gateway: http://localhost:3000
# - Auth: http://localhost:3001
# - User: http://localhost:3002
# - CV Command: http://localhost:3003
# - CV Query: http://localhost:3004
\`\`\`

---

## 📬 Main API Endpoints (via gateway)

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | `/auth/register`      | Register new user            |
| POST   | `/auth/login`         | Login and receive JWT        |
| POST   | `/user/me`            | Create personal profile      |
| GET    | `/user/me`            | Fetch user profile           |
| POST   | `/cv/create`          | Create a new CV              |
| POST   | `/cv/add-section`     | Add a section to CV          |
| POST   | `/cv/rename`          | Rename a CV                  |
| GET    | `/cv/list`            | List all user's CVs          |
| GET    | `/cv/:id`             | View full details of a CV    |
| POST   | `/cv/:id/replay`      | Replay CV state from events  |


## 📚 Technologies Used

- 🧱 Microservices Architecture
- 📦 MongoDB with Event Store modeling
- 🧠 Event Sourcing + CQRS pattern
- 🔐 JWT Authentication and Guards
- 🔄 Projection and Event Replay
- 🐳 Docker + Docker Compose
- ⚡ React + Vite + Block Editor

---

## 📎 Notes

- Currently using REST to sync events from `cv-command` to `cv-query`
- Easy to upgrade to Kafka or other message queues in future
- Can integrate Elasticsearch for advanced search and indexing

---

## 📄 License

This project is for educational purposes. Built with ❤️ by our team.
