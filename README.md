# 🧩 CV Builder - Microservices Architecture with Event Sourcing

---

## 👥 Team Members

- **Nguyễn Văn A**
- **Trần Thị B**
- **Lê Văn C**

---

## 📌 Project Topic

**Build a CV Creation Platform** with version control, history tracking, and real-time preview — powered by event sourcing.

---

## ⚙️ Technologies Used

- 🧠 **NestJS** — Backend microservices
- 🎨 **React + Vite** — Frontend UI with Tiptap Editor
- 📡 **Socket.IO** — Realtime communication (optional)
- 🍃 **MongoDB** — Event store & projections
- 🔐 **JWT + Passport** — Authentication
- 🐳 **Docker + Docker Compose** — Deployment & DevOps
- 📑 **OpenAPI YAML** — API specifications

---

## 📁 Folder Structure

```
cv-builder/
├── README.md
├── .env.example
├── docker-compose.yml
│
├── docs/
│   ├── architecture.md
│   ├── analysis-and-design.md
│   ├── asset/
│   └── api-specs/
│       ├── auth.yaml
│       ├── user.yaml
│       ├── cv-command.yaml
│       └── cv-query.yaml
│
├── scripts/
│   └── init.sh
│
├── services/
│   ├── auth/
│   ├── user/
│   ├── cv-command/
│   ├── cv-query/
│   └── notification/  # optional
│
├── gateway/
└── frontend/
```

---

## 🚀 Getting Started

1. **Clone this repository**

   ```bash
   git clone https://github.com/your-username/cv-builder.git
   cd cv-builder
   ```

2. **Copy environment variables**

   ```bash
   cp .env.example .env
   ```

3. **Start all services**

   ```bash
   docker-compose up --build
   ```

---

## 🧪 Development Notes

- Use `docs/api-specs/*.yaml` to define APIs (OpenAPI format).
- Use event replay logic to rebuild CV projections.
- Use signature-based event integrity checks for security.

---

## 🧭 System Highlights

- ✅ **CV creation and editing** via event sourcing
- 🔁 **Replayable event log** with signature verification
- 🔍 **Version history** & `GET /cv/:id/version/:n` to view snapshots
- 🔐 **JWT-based login & user isolation**
- 📄 **Multiple CV templates**
- 📡 **Realtime projection rebuilding** (WebSocket-ready)

---

## 📚 Recommended Tasks

- [ ] Document system design in `docs/architecture.md`
- [ ] Define API schemas in `docs/api-specs/`
- [ ] Implement more event types: `SECTION_UPDATED`, `CV_RENAMED`, etc.
- [ ] Add undo/redo capability via event replay

---

## 👩‍🏫 Assignment Submission

Make sure:
- `README.md` explains project structure and usage clearly
- Team member contributions are listed
- Project is runnable with: `docker-compose up --build`



---
