**Team Members**:
- Trần Thái Bình Minh – B21DCVT034
- Hoàng Trọng Khôi - B21DCVT026
- Nguyễn Đình Minh - B21DCCN086

# 🏗️ System Architecture - CV Builder Microservices

## 📌 Overview

This CV Builder system is designed using **microservices architecture** to provide a modular, scalable, and event-driven approach to online CV creation. Inspired by the editing style of Google Docs, the system supports versioning, live updates, and customizable templates.

---

## 🧩 System Components

- **Auth Service**:
  - Manages user authentication and JWT issuance.
  - Handles registration and login using hashed credentials.

- **User Service**:
  - Stores and manages user profile information.
  - Allows updating user metadata such as name, avatar, etc.

- **CV-Command Service**:
  - Handles all **write operations** using event sourcing (create CV, edit section, rename).
  - Persists domain events into the **event store (MongoDB)**.

- **CV-Query Service**:
  - Handles **read operations** by building projections from event stream.
  - Supports version history, replay, and querying CV state.

- **API Gateway**:
  - Routes requests to internal services based on path.
  - Centralizes authentication and request logging.

- **Frontend (React + Vite)**:
  - Provides a modern, rich-text editor using Tiptap.
  - Allows drag-and-drop block editing and real-time preview of CVs.

---

## 🔁 Communication

- **External (Frontend ⇄ Gateway)**: via **REST**
- **Internal (Gateway ⇄ Services)**: via **REST** using Docker internal DNS (e.g. `http://auth:3000`)
- **Data propagation**:
  - `cv-command` writes events to Mongo
  - `cv-query` reads from event store and builds projections

---

## 🔄 Data Flow

1. User logs in → JWT issued by `auth`
2. User creates/edit CV → request sent to `gateway` → forwarded to `cv-command`
3. `cv-command` writes event to event store
4. `cv-query` reads events → updates projection
5. User views CV → `gateway` routes read to `cv-query`
6. Realtime updates (optional): via WebSocket / polling

**External dependencies**:
- MongoDB (3 instances): for event store, projection store, and user DB

---

## 🖼️ Diagram

Refer to the architecture diagram in:

```
docs/asset/system-architecture.png
```

---

## ⚙️ Scalability & Fault Tolerance

- Each service is containerized → can be scaled independently using Docker/Kubernetes
- Stateless services → easy to duplicate
- Event log is append-only → supports recovery and audit
- Database-per-service → isolates failures and reduces coupling
- Optional: add message queue (Kafka/RabbitMQ) to decouple read/write further

---

## ✅ Summary

This architecture provides:
- Clear separation of responsibilities
- Strong audit trail via event sourcing
- Flexible scalability and maintainability
- Reusable, extendable microservices