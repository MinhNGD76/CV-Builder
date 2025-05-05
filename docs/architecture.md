**Team Members**:
- Trần Thái Bình Minh – B21DCVT034
- Hoàng Trọng Khôi - B21DCVT026
- Nguyễn Đình Minh - B21DCCN086

# 🏗️ System Architecture - CV Builder Microservices

## 📌 Overview

This CV Builder system is designed using **microservices architecture** to provide a modular, scalable, and event-driven approach to online CV creation. Inspired by the editing style of Google Docs, the system supports versioning, live updates, and customizable templates.

---

## 🧩 Logical Component Architecture

### Service Components

- **Auth Service**:
  - Manages user authentication and JWT issuance
  - Handles registration and login using hashed credentials
  - Components:
    - **AuthController**: Exposes REST endpoints for registration and login
    - **AuthService**: Implements authentication business logic
    - **JwtStrategy**: Validates JWT tokens
    - **UserSchema**: Defines authentication data model

- **User Service**:
  - Stores and manages user profile information
  - Allows updating user metadata such as name, avatar, etc.
  - Components:
    - **UserController**: Handles profile CRUD operations
    - **UserService**: Implements profile business logic
    - **UserProfileSchema**: Defines profile data model
    - **JwtAuthGuard**: Protects private endpoints

- **CV-Command Service**:
  - Handles all **write operations** using event sourcing (create CV, edit section, rename)
  - Persists domain events into the **event store (MongoDB)**
  - Signs events for integrity validation
  - Components:
    - **CvController**: Exposes endpoints for CV modifications
    - **CvService**: Implements event emission and signature
    - **EventSchema**: Defines event data structure
    - **JwtAuthGuard**: Ensures authenticated access
  - **Note**: The undo functionality is currently in development and not yet functional

- **CV-Query Service**:
  - Handles **read operations** by building projections from event stream
  - Supports version history, replay, and querying CV state
  - Components:
    - **CvQueryController**: Provides endpoints for CV retrieval
    - **CvQueryService**: Rebuilds CV state from events
    - **ProjectionSchema**: Defines the read model structure
    - **EventConsumer**: Listens for new events to update projections
  - **Note**: The version history and rollback features are currently in development and not yet functional

- **API Gateway**:
  - Routes requests to internal services based on path
  - Centralizes authentication and request logging
  - Components:
    - **GatewayController**: Routes API requests
    - **HttpService**: Forwards requests to microservices
    - **AuthMiddleware**: Passes authentication headers

- **Frontend (React + Vite)**:
  - Provides a modern, rich-text editor
  - Allows block editing and real-time preview of CVs
  - Components:
    - **AuthModule**: Handles login/registration UI
    - **EditorModule**: Block-based CV editor
    - **PreviewModule**: Template-based CV renderer
    - **ApiService**: Communication with backend

### Cross-Cutting Components

- **Authentication Framework**: JWT-based authentication system
- **Event Sourcing Infrastructure**: Event storage and playback mechanisms
- **Cryptographic Signing Service**: Ensures event integrity
- **Data Validation Layer**: Validates inputs across services

---

## 🏢 Physical Architecture

### Deployment Units

- **Docker Containers**:
  - `auth-service`: Authentication service (port 3000)
  - `user-service`: User profile service (port 3000)
  - `cv-command-service`: Event writing service (port 3000)
  - `cv-query-service`: Projection reading service (port 3000)
  - `gateway-service`: API gateway (port 3000, exposed as 80)
  - `frontend-app`: Web frontend (port 80)

- **Databases**:
  - `mongo-auth`: Authentication data store
  - `mongo-user`: User profile data store
  - `mongo-event-store`: Event storage for CV operations
  - `mongo-projection`: CV projections for read operations

### Network Architecture

- **Internal Network**:
  - Service-to-service communication via Docker network
  - Services reference each other by container name (e.g., `http://auth:3000`)
  - Gateway is the only public-facing component

### Infrastructure Resources

- **Compute Resources**:
  - Minimum: 2 vCPUs per service
  - Recommended: 4+ vCPUs for the system

- **Memory Resources**:
  - Minimum: 512MB RAM per service
  - Recommended: 1GB+ RAM per service

- **Storage Resources**:
  - Event Store: Grows with operation volume (min 10GB)
  - Projection Store: Proportional to CV count (min 5GB)
  - Other services: 1GB each

---

## 🔁 Communication Patterns

### Synchronous Communication

- **External (Frontend ⇄ Gateway)**:
  - Protocol: REST over HTTP
  - Authentication: JWT bearer tokens
  - Format: JSON request/response

- **Internal (Gateway ⇄ Services)**:
  - Protocol: REST using Docker internal DNS
  - Service Discovery: Container names (e.g., `http://auth:3000`)
  - Authentication: Forward JWT tokens from gateway

### Asynchronous Communication

- **Event-Based Communication**:
  - `cv-command` → event store → `cv-query`
  - Event store serves as the source of truth
  - Events are persisted in chronological order
  - Each event is cryptographically signed

---

## 🔄 Data & Event Flow

### Authentication Flow

```
┌──────────┐     ┌─────────┐     ┌────────────┐
│ Frontend │────▶│ Gateway │────▶│ Auth Svc   │
└──────────┘     └─────────┘     └────────────┘
      ▲               ▲                │
      │               │                │
      └───────────────┴────────────────┘
           JWT token response
```

1. User submits credentials from Frontend
2. Gateway forwards to Auth Service
3. Auth Service validates and issues JWT
4. Token returns via Gateway to Frontend
5. Frontend stores token for subsequent requests

### Profile Management Flow

```
┌──────────┐     ┌─────────┐     ┌────────────┐
│ Frontend │────▶│ Gateway │────▶│ User Svc   │
└──────────┘     └─────────┘     └────────────┘
                                       │
                                       ▼
                                  ┌────────────┐
                                  │ User DB    │
                                  └────────────┘
```

1. Frontend sends profile data with JWT header
2. Gateway validates token and forwards to User Service
3. User Service processes request and updates database
4. Response follows reverse path back to Frontend

### CV Command Flow (Write Path)

```
┌──────────┐     ┌─────────┐     ┌────────────┐
│ Frontend │────▶│ Gateway │────▶│ CV-Command │
└──────────┘     └─────────┘     └────────────┘
                                       │
                                       ▼
                                  ┌────────────┐
                                  │ Event Store│
                                  └────────────┘
```

1. User makes CV edit in Frontend
2. Frontend sends operation to Gateway with JWT
3. Gateway forwards to CV-Command Service
4. CV-Command validates, signs and persists event
5. Command acknowledgment returns to Frontend

**Note**: The undo functionality shown in the API is currently in development and not yet functional.

### CV Query Flow (Read Path)

```
┌──────────┐     ┌─────────┐     ┌────────────┐     ┌────────────┐
│ Frontend │────▶│ Gateway │────▶│ CV-Query   │────▶│ Projection │
└──────────┘     └─────────┘     └────────────┘     │ Store      │
      ▲               ▲                │            └────────────┘
      │               │                │                  ▲
      └───────────────┴────────────────┘                  │
                Response with CV data                      │
                                                    ┌────────────┐
                                                    │ Event Store│
                                                    └────────────┘
```

1. Frontend requests CV data from Gateway
2. Gateway forwards to CV-Query Service
3. CV-Query Service retrieves projection
4. If needed, CV-Query rebuilds projection from events
5. CV data returns to Frontend for display

### Projection Update Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│ CV-Command │────▶│ Event Store│────▶│ CV-Query   │
└────────────┘     └────────────┘     └────────────┘
                                           │
                                           ▼
                                      ┌────────────┐
                                      │ Projection │
                                      │ Store      │
                                      └────────────┘
```

1. CV-Command Service persists new event
2. CV-Query Service detects new event (polling or notification)
3. CV-Query Service updates projection for affected CV
4. Updated projection is available for subsequent reads

---

## 🖼️ System Architecture Diagram

```
┌─────────────────────────┐
│       Web Browser       │
└───────────┬─────────────┘
            │
            ▼
┌───────────────────────────────────────────────────┐
│                  Frontend (React)                 │
└───────────────────┬───────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│                  API Gateway                      │
└─┬─────────────────┬───────────────────┬───────────┘
  │                 │                   │
  ▼                 ▼                   ▼
┌──────────┐   ┌──────────┐   ┌────────────────┐   ┌────────────────┐
│Auth Svc  │   │User Svc  │   │CV-Command Svc  │   │CV-Query Svc    │
└─────┬────┘   └─────┬────┘   └───────┬────────┘   └────────┬───────┘
      │              │                │                     │
      ▼              ▼                ▼                     ▼
┌──────────┐   ┌──────────┐   ┌────────────────┐   ┌────────────────┐
│Auth DB   │   │User DB   │   │Event Store DB  │──▶│Projection DB   │
└──────────┘   └──────────┘   └────────────────┘   └────────────────┘
```

Refer to higher resolution diagram at:
```
docs/asset/system-architecture.png
```

---

## ⚙️ Scalability & Fault Tolerance

- **Horizontal Scaling**:
  - Each service is containerized → can be scaled independently
  - Stateless services enable easy replication
  
- **Resilience**:
  - Event log is append-only → supports recovery and audit
  - Database-per-service → isolates failures
  - Event sourcing allows system rebuild from events
  
- **Performance Optimization**:
  - Read/write separation (CQRS) improves scaling
  - Projections optimize read performance
  - Future enhancement: message queue (Kafka/RabbitMQ) for async communication

---

## ✅ Summary

This architecture provides:
- **Command-Query Responsibility Segregation**: Separate write and read models
- **Event Sourcing**: Complete audit trail for all CV changes
- **Microservices**: Independent deployment and scaling of components
- **RESTful Communication**: Standardized interfaces between services
- **Docker Containerization**: Consistent deployment across environments
- **JWT Security**: Token-based authentication for all requests
- **MongoDB Persistence**: Flexible document storage for all services

**Implementation Note**: The undo and version rollback features described in the architecture are currently in development and not yet functional. These features will be added in future releases.