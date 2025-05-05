<div align="center">
  <h1>🧩 CV Builder</h1>
  <p><strong>A Microservices-Based CV Creation Platform with Event Sourcing</strong></p>
  <p>
    <a href="#-team-members">Team</a>
    <a href="#-description">Description</a> •
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-usage">Usage</a> •
    <a href="#-technologies-used">Technologies</a> •
  </p>
</div>

---

## 👥 Team Members

- **[Trần Thái Bình Minh](https://github.com/BinhMinhPTIT)** – B21DCVT034
  - Architecture design
  - CV Command service implementation
  - Event sourcing functionality
  
- **[Hoàng Trọng Khôi](https://github.com/bunchangon711)** - B21DCVT026
  - Frontend development
  - UI/UX design
  - Template implementation
  
- **[Nguyễn Đình Minh](https://github.com/MinhNGD76)** - B21DCCN086
  - Authentication service
  - API Gateway
  - System integration

## 📝 Description

CV Builder is an innovative platform that revolutionizes the way professionals create, manage, and version control their resumes. Using a microservices architecture with event sourcing principles, our application provides a Google Docs-like experience with additional capabilities specific to CV creation.

### Motivation

Traditional CV builders lack flexibility, version control, and often produce generic-looking results. We wanted to create a solution that gives users complete control over their professional presentation while maintaining an intuitive interface.

### Problem Solved

CV Builder addresses several key challenges in resume creation:
- **Version Control**: Track all changes with a complete chronological history
- **Template Flexibility**: Switch between visual templates without losing content
- **Content Organization**: Structured sections make information management intuitive
- **Collaborative Potential**: Architecture supports future collaborative editing features
- **Data Integrity**: Event sourcing ensures no data is ever lost

### Learning Outcomes

Building this system provided valuable insights into:
- Implementing CQRS (Command Query Responsibility Segregation) pattern
- Designing event-driven microservices architecture
- Applying event sourcing for data persistence and history
- Securing distributed systems with JWT authentication
- Creating scalable and maintainable service boundaries

## 🖼️ Platform Overview

> Create professional CVs with version history, template customization, and real-time preview.

<div align="center">
  <!-- Future UI Screenshots Placeholder -->
  <table>
    <tr>
      <td align="center">
        <img src="docs/asset/placeholder-editor.png" alt="CV Editor" width="400px"/>
        <br />
        <em>CV Editor Interface</em>
      </td>
      <td align="center">
        <img src="docs/asset/placeholder-preview.png" alt="Template Preview" width="400px"/>
        <br />
        <em>Template Preview</em>
      </td>
    </tr>
  </table>
</div>

## ✨ Features

- **Block-Based Editor**: Create and customize CV sections with an intuitive drag-and-drop interface
- **Version Control**: Track all changes with complete revision history
- **Template Switching**: Apply different templates without losing content
- **Event Sourcing**: All operations are stored as immutable events
- **Real-Time Updates**: Changes are processed and reflected immediately
- **Secure Access**: JWT-based authentication and data isolation
- **Undo Capability**: Revert recent changes when needed
- **Cryptographic Integrity**: Event signatures ensure data hasn't been tampered with
- **Multi-format Export**: Export your CV in different formats (PDF, HTML)
- **Responsive Design**: Access your CV from any device

## 🏗️ Architecture

This project implements a microservices architecture with event sourcing and CQRS (Command Query Responsibility Segregation) patterns:

<div align="center">
  <img src="docs/asset/system-architecture.png" alt="System Architecture" width="700px"/>
</div>

### Key Components

- **API Gateway**: Single entry point for all client requests
- **Auth Service**: Handles user registration and authentication
- **User Service**: Manages user profile information
- **CV Command Service**: Processes write operations as events
- **CV Query Service**: Builds read-optimized projections from events

For detailed architecture information, see [architecture.md](docs/architecture.md).

## 🚀 Installation

### Prerequisites

- Docker and Docker Compose
- Node.js v18+ (for local development)
- Git

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jnp2018/mid-project-mid-project-026086034
   cd mid-project-mid-project-026086034
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Open the `.env` file and configure the following variables:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   ```

3. **Build and start the containers**
   ```bash
   docker-compose up --build
   ```

4. **Verify installation**
   
   Once all containers are running, you should be able to access:
   - Frontend: http://localhost:80
   - API Documentation: http://localhost:80/api-docs

### Local Development Setup

For development without Docker:

1. **Install dependencies for each service**
   ```bash
   cd services/auth-service && npm install
   cd ../user && npm install
   cd ../cv-command && npm install
   cd ../cv-query && npm install
   cd ../../gateway && npm install
   cd ../frontend && npm install
   ```

2. **Start services individually**
   ```bash
   # Start each service in a separate terminal
   cd services/auth-service && npm run start:dev
   cd services/user && npm run start:dev
   # etc.
   ```

## 💻 Usage

### Creating Your First CV

1. **Register an account**
   - Navigate to the signup page
   - Enter your email and password
   - Complete the registration process

2. **Create a new CV**
   - Click on "Create New CV" button
   - Enter a title for your CV
   - Select a template from the available options
   - Click "Create"

3. **Add content to your CV**
   - Use the block-based editor to add sections
   - Available section types include Personal Information, Education, Work Experience, Skills, etc.
   - Fill in the details for each section

4. **Preview and switch templates**
   - Click on "Preview" to see how your CV looks
   - Try different templates using the template selector
   - Your content will remain the same across all templates

5. **Access version history**
   - View the complete history of changes
   - Restore previous versions if needed

<div align="center">
  <img src="docs/asset/usage-flow.png" alt="Usage Flow" width="700px"/>
  <br />
  <em>CV Creation Workflow</em>
</div>

## 💻 Project Structure

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
│   ├── auth-service/
│   ├── user/
│   ├── cv-command/
│   ├── cv-query/
│   └── notification/  # optional
│
├── gateway/
└── frontend/
```


## ⚙️ Technologies Used

- 🧠 **NestJS** — Backend microservices
- 🎨 **React + Vite** — Frontend UI with Tiptap Editor
- 📡 **Socket.IO** — Realtime communication
- 🍃 **MongoDB** — Event store & projections
- 🔐 **JWT + Passport** — Authentication
- 🐳 **Docker + Docker Compose** — Deployment & DevOps
- 📑 **OpenAPI YAML** — API specifications
- 🔄 **Event Sourcing** — Data persistence pattern
- 🖥️ **CQRS Pattern** — Command Query Responsibility Segregation

## 🧭 System Highlights

- ✅ **CV creation and editing** via event sourcing
- 🔁 **Replayable event log** with signature verification
- 🔍 **Version history** & `GET /cv/:id/version/:n` to view snapshots
- 🔐 **JWT-based login & user isolation**
- 📄 **Multiple CV templates**
- 📡 **Realtime projection rebuilding**

## 🤝 How to Contribute

We welcome contributions to the CV Builder project! Here's how you can help:

1. **Fork the repository**
   - Create your feature branch: `git checkout -b feature/amazing-feature`
   - Commit your changes: `git commit -m 'Add some amazing feature'`
   - Push to the branch: `git push origin feature/amazing-feature`
   - Open a Pull Request

2. **Coding Guidelines**
   - Follow the existing code style
   - Write tests for new features
   - Update documentation accordingly

3. **Reporting Issues**
   - Use the issue tracker to report bugs
   - Include reproducible steps and screenshots if possible

4. **Feature Requests**
   - Suggest new features through the issue tracker
   - Provide clear use cases and scenarios

We follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

