# 📊 Microservices System - Analysis and Design

This document outlines the **analysis** and **design** process for our microservices-based CV builder system using event sourcing. It explains the key decisions and architecture behind the system.

---

## 1. 🎯 Problem Statement

A CV builder platform that allows users to create, edit, and version control their resumes (CVs), inspired by the real-time editing style of Google Docs.

- **Users**: Job seekers, students, professionals
- **Main goals**:
  - Create and edit CVs using rich editor blocks
  - View and track CV version history
  - Export CVs in different templates
  - Authenticate securely with JWT
- **Processed data**:
  - User accounts (email, password)
  - CV content: blocks, sections, templates
  - Versioning events (SECTION_ADDED, CV_RENAMED, etc.)

---

## 2. 🧩 Identified Microservices

| Service Name   | Responsibility                                      | Tech Stack     |
|----------------|------------------------------------------------------|----------------|
| `auth`         | Handles user registration, login, and JWT issuance  | NestJS + Mongo |
| `user`         | Manages user profile data                           | NestJS + Mongo |
| `cv-command`   | Writes events (e.g., create CV, update sections)    | NestJS + Mongo |
| `cv-query`     | Reconstructs CV projection from events for reading  | NestJS + Mongo |
| `gateway`      | Routes requests to the appropriate service           | NestJS         |
| `frontend`     | UI using block-based editor + preview templates     | React + Vite   |

---

## 3. 🔄 Service Communication

- Gateway ⇄ auth / user / cv-command / cv-query: **REST APIs**
- cv-command → cv-query: **indirect via event store (MongoDB)**
- frontend → gateway: **REST + (optionally WebSocket)**

---

## 4. 🗂️ Data Design

Each service owns its own database (Database-per-service pattern):

### `auth`
- **Collection**: `users`
- Fields:
  - `email`: string
  - `password`: hashed string

**Example:**
```json
{
  "email": "user@example.com",
  "password": "$2b$10$encryptedhash"
}
```

---

### `user`
- **Collection**: `profiles`
- Fields:
  - `userId`: reference to auth user
  - `fullName`: string
  - `avatarUrl`: string
  - `bio`: string (optional)

**Example:**
```json
{
  "userId": "642a8f123abc",
  "fullName": "John Doe",
  "avatarUrl": "https://cdn.example.com/avatar.jpg",
  "bio": "Full-stack developer"
}
```

---

### `cv-command`
- **Collection**: `events`
- Fields:
  - `eventType`: string (`CV_CREATED`, `SECTION_UPDATED`, etc.)
  - `cvId`: string
  - `userId`: string
  - `payload`: object (custom per event)
  - `timestamp`: datetime
  - `signature`: string (HMAC)

**Example:**
```json
{
  "eventType": "CV_CREATED",
  "cvId": "cv-123",
  "userId": "642a8f123abc",
  "payload": {
    "title": "My Developer CV",
    "templateId": "template-1"
  },
  "timestamp": "2024-04-17T12:00:00Z",
  "signature": "a3ff...d5ab"
}
```

---

### `cv-query`
- **Collection**: `cvs` (projection)
- Fields:
  - `cvId`: string
  - `userId`: string
  - `title`: string
  - `templateId`: string
  - `blocks`: array of sections

**Example:**
```json
{
  "cvId": "cv-123",
  "userId": "642a8f123abc",
  "title": "My Developer CV",
  "templateId": "template-1",
  "blocks": [
    {
      "id": "block-1",
      "type": "header",
      "content": "John Doe"
    },
    {
      "id": "block-2",
      "type": "section",
      "title": "Experience",
      "items": [
        {
          "position": "Software Engineer",
          "company": "ABC Corp",
          "years": "2020 - Present"
        }
      ]
    }
  ]
}
```

---

## 5. 🔐 Security Considerations

- 🔑 JWT-based authentication (issued from `auth`)
- 🧼 Input validation with DTOs + Pipes (NestJS)
- 🧾 Event Signing using HMAC (to ensure event integrity)
- 🔒 Role-based access (optional for admin use cases)

---

## 6. 📦 Deployment Plan

- All services are containerized using **Docker**
- Managed with `docker-compose`:
  - Each service has its own `Dockerfile`
  - MongoDB instances per service (event store, projection, user data)
- Configurations stored in `.env` files

---

## 7. 🎨 Architecture Diagram

```
+------------+        +---------------------+
|  Frontend  |  --->  |      Gateway        |
| (React/Vite)|       |   (NestJS API GW)   |
+------------+        +----------+----------+
                                 |
    +-------------+     +----------------+     +----------------+
    | Auth Service| <-> |  User Service  |     |  CV-Command    |
    |  (NestJS)   |     | (Profiles)     |     |  (writes event)|
    +-------------+     +----------------+     +--------+-------+
                                                     |
                                                     v
                                             +---------------+
                                             |  Mongo Events |
                                             +---------------+
                                                     |
                                                     v
                                             +----------------+
                                             |   CV-Query     |
                                             |  (Projection)  |
                                             +----------------+
```

---

## ✅ Summary

This architecture is suitable for the CV Builder system because:

- ✅ **CQRS pattern**: Read and write operations are separated for scalability and simplicity.
- ✅ **Event Sourcing**: Tracks every CV change as an event → enables version control, undo/redo, and replay.
- ✅ **Security-first**: JWT authentication + signed events protect system integrity.
- ✅ **Modular Microservices**: Each responsibility is encapsulated in its own service → easier for teamwork and scaling.
- ✅ **Dockerized and Deployable**: Using `docker-compose`, the full system runs in minutes.
- ✅ **Extensibility**: Can easily add new features like collaborative editing, sharing CV links, etc.

---

**Team Members**:
- Trần Thái Bình Minh – B21DCVT034
- Hoàng Trọng Khôi - B21DCVT026
- Nguyễn Đình Minh - B21DCCN086

---