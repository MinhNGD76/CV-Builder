**Team Members**:
- Trần Thái Bình Minh – B21DCVT034
- Hoàng Trọng Khôi - B21DCVT026
- Nguyễn Đình Minh - B21DCCN086

# 📊 CV Builder System - Service-Oriented Analysis & Design

## 1. 🎯 Problem Statement

Our system addresses the need for a professional CV builder platform designed for job seekers and professionals to create, manage, and version control their resumes with a document-editing experience similar to Google Docs. Users need to create professional CVs without design expertise, track version history, maintain consistent formatting, and reduce time spent on CV organization.

**Target Users**: 
- Job seekers and students entering the job market
- Career professionals updating their credentials
- HR departments helping candidates prepare resumes

**Business Value**:
- Easy creation of professional CVs without design expertise
- Complete version history tracking for all changes
- Consistent CV formatting across multiple templates
- Significant time savings on CV formatting and organization

## 2. 🧩 REST Service Modeling Process

Following a comprehensive service-oriented approach, we utilized a structured 15-step REST service modeling process to design our microservices. The process begins with business process decomposition and gradually refines into concrete service definitions.

### Step 1: Decompose Business Process

**User Authentication Process**:
- Register new user
- Login user
- Validate authentication token
- Reset password
- Update user credentials

**Profile Management Process**:
- Create user profile
- Update user profile information
- Retrieve user profile
- Delete user profile

**CV Creation and Management Process**:
- Initialize new CV
- Select CV template
- Add CV section
- Edit CV section content
- Delete CV section
- Rename CV
- List user's CVs
- Retrieve specific CV
- Delete CV

**Version Management Process**:
- Record content change event
- Sign event with cryptographic signature
- Store event in chronological order
- Retrieve CV state at specific version
- Rollback to previous version
- Compare versions

### Step 2: Filter Out Unsuitable Actions

We identified actions unsuitable for service implementation:
- Manual template design process (handled by designers outside the system)
- Manual CV content verification (responsibility of the user)
- Physical sharing of printed CVs (outside system boundaries)

### Step 3: Define Entity Service Candidates

Entity service candidates that manage specific business entities:

**User Entity Service**:
- Get User Profile
- Update User Profile
- Create User Profile
- Manages user data as a fundamental business entity

**CV Entity Service**:
- Get CV
- List CVs
- Get CV Sections
- Create CV Record
- Manages CV data as a core business entity

**Event Entity Service**:
- Get Event
- Get Event History
- Verify Event Integrity
- Manages event data for audit and history

**Template Entity Service**:
- Get Template
- List Templates
- Apply Template
- Manages template data as a business entity

### Step 4: Identify Process-Specific Logic

Task services that orchestrate business processes:

**Authentication Task Service**:
- Register
- Login
- Validate Token
- Orchestrates the authentication process

**CV Editing Task Service**:
- Create CV
- Update CV Section
- Delete CV Section
- Rename CV
- Orchestrates CV editing workflows

**Version Management Task Service**:
- Record Version
- Retrieve Version
- Compare Versions
- Orchestrates version control processes

### Step 5: Identify Resources

**User Resources**:
- /users/ - User accounts
- /profiles/ - User profile information

**CV Resources**:
- /cvs/ - CV documents
- /sections/ - CV content sections
- /templates/ - CV formatting templates

**Event Resources**:
- /events/ - Change events
- /versions/ - CV versions

### Step 6: Associate Service Capabilities with Resources and Methods

We associated service capabilities with appropriate HTTP methods and resources:

**User Service**:
- Get User Profile (GET + /profiles/{userId})
- Update User Profile (PUT + /profiles/{userId})
- Create User Profile (POST + /profiles/)

**CV-Command Service**:
- Create CV (POST + /cvs/)
- Add Section (POST + /cvs/{cvId}/sections/)
- Update Section (PUT + /cvs/{cvId}/sections/{sectionId})
- Delete Section (DELETE + /cvs/{cvId}/sections/{sectionId})
- Rename CV (PUT + /cvs/{cvId}/title)
- Change Template (PUT + /cvs/{cvId}/template)

**CV-Query Service**:
- Get CV (GET + /cvs/{cvId})
- List CVs (GET + /cvs/)
- Get CV Version (GET + /cvs/{cvId}/versions/{versionId})
- List CV Versions (GET + /cvs/{cvId}/versions/)

**Auth Service**:
- Register (POST + /auth/register)
- Login (POST + /auth/login)
- Validate Token (POST + /auth/validate)

### Step 7: Apply Service-Orientation

We applied service-orientation principles to refine our service candidates:

**Service Autonomy**: Each service is designed to have high independence from other services. For example, the CV-Command service manages its own event store while the CV-Query service manages its own projections.

**Service Statelessness**: All service operations are designed to be stateless, with state information stored in databases rather than in service memory.

**Service Discoverability**: Services are named descriptively and include standard documentation to promote discoverability.

**Service Composability**: Services are designed to be composed together to form more complex functionalities. For example, the CV-Query service composes with Auth service for user verification.

**Service Loose Coupling**: Services interact through well-defined interfaces, minimizing dependencies.

### Step 8: Identify Service Composition Candidates

Primary service compositions:

**User Registration Flow**:
```
Client → Auth Service (register) → User Service (create profile)
```

**CV Creation Flow**:
```
Client → Auth Service (validate) → CV-Command Service (create CV) → Event Store → CV-Query Service (build projection)
```

**CV Editing Flow**:
```
Client → Auth Service (validate) → CV-Command Service (edit section) → Event Store → CV-Query Service (update projection)
```

**CV Viewing Flow**:
```
Client → Auth Service (validate) → CV-Query Service (get CV with template)
```

### Step 9: Analyze Processing Requirements

Each service's processing requirements:

**Auth Service**:
- Requires secure password hashing
- Needs JWT token generation and validation
- Must maintain user credential security

**User Service**:
- Needs profile data storage and retrieval
- Requires authorization checks before profile updates

**CV-Command Service**:
- Requires event signing for integrity
- Needs atomic event persistence
- Must validate user ownership of CVs

**CV-Query Service**:
- Requires efficient projection building
- Needs version history management
- Must apply templates to CV content

### Step 10: Define Utility Service Candidates

Utility services that provide application functions across multiple business contexts:

**API Gateway Utility Service**:
- Route (POST, GET, PUT, DELETE + /*)
- Forward Authentication Headers (POST, GET, PUT, DELETE + /*)
- Provides infrastructure support functions

**Notification Utility Service** (future enhancement):
- Send Email (POST + /notifications/email)
- Send In-App Alert (POST + /notifications/alerts)
- Provides cross-cutting notification capabilities

### Step 11: Define Microservice Candidates

These microservice are candidates that have specific autonomy and scaling needs:

**Auth Microservice**:
- Register (POST + /auth/register)
- Login (POST + /auth/login)
- Validate (POST + /auth/validate)
- Highly specialized for security processing

**User Microservice**:
- GetProfile (GET + /profiles/{userId})
- UpdateProfile (PUT + /profiles/{userId})
- CreateProfile (POST + /profiles/)
- Independently deployable user management

**CV-Command Microservice**:
- CreateCV (POST + /cvs/)
- UpdateSection (PUT + /cvs/{cvId}/sections/{sectionId})
- DeleteSection (DELETE + /cvs/{cvId}/sections/{sectionId})
- RenameCV (PUT + /cvs/{cvId}/title)
- Specialized for write operations with event sourcing

**CV-Query Microservice**:
- GetCV (GET + /cvs/{cvId})
- ListCVs (GET + /cvs/)
- GetVersion (GET + /cvs/{cvId}/versions/{versionId})
- Specialized for read operations with projection processing

### Step 12: Apply Service-Orientation to Utility Services

Applied service-orientation principles to utility services:

**API Gateway**:
- Designed for high availability and scalability
- Implements service abstraction to hide backend complexity
- Centralized authentication and logging

### Step 13: Revise Service Composition Candidates

After reviewing all services, we finalized these service compositions:

**CV Editing Composition**:
```
Client → API Gateway → Auth Service → CV-Command Service → Event Store → CV-Query Service
```

**CV Viewing Composition**:
```
Client → API Gateway → Auth Service → CV-Query Service → Template Application
```

### Step 14: Revise Resource Definitions

We refined our resource definitions to ensure clarity:

**Auth Resources**:
- /auth/register - User registration endpoint
- /auth/login - User login endpoint
- /auth/validate - Token validation endpoint

**User Resources**:
- /profiles/{userId} - User profile information

**CV Resources**:
- /cvs/ - Collection of CVs
- /cvs/{cvId} - Individual CV
- /cvs/{cvId}/sections - Collection of sections in a CV
- /cvs/{cvId}/sections/{sectionId} - Individual section in a CV
- /cvs/{cvId}/versions - Collection of CV versions
- /cvs/{cvId}/versions/{versionId} - Specific CV version

### Step 15: Revise Resource Definitions and Capability Grouping

We finalized our service structure with clearly defined resource boundaries:

**Auth Service**: Handles all authentication operations with JWT token generation
- Resources: /auth/register, /auth/login, /auth/validate
- Database: MongoDB auth store

**User Service**: Manages user profile information
- Resources: /profiles/*
- Database: MongoDB user profile store

**CV-Command Service**: Processes all CV write operations as events
- Resources: /cvs/* (write operations)
- Database: MongoDB event store

**CV-Query Service**: Handles all CV read operations via projections
- Resources: /cvs/* (read operations)
- Database: MongoDB projection store

**API Gateway**: Routes all requests to appropriate services
- Resources: /* (all endpoints)
- No database (stateless)

## 3. 🔄 Service-Oriented Design

### Service Classification

Our CV Builder system employs four primary service types following service-oriented architecture principles:

#### Task Services
Task services orchestrate business processes by composing other services to fulfill specific business use cases:

**API Gateway**:
- **Purpose**: Orchestrates request routing and authentication flow
- **Characteristics**: 
  - Process-centric service that manages workflows
  - Composes multiple entity and utility services
  - Handles cross-cutting concerns like authentication forwarding
  - Stateless processing model

#### Entity Services
Entity services manage core business entities and their lifecycle:

**User Service**:
- **Purpose**: Manages user profile information as a business entity
- **Characteristics**:
  - Entity-centric service with high reusability
  - Provides CRUD operations for user profiles
  - Maintains entity integrity and business rules
  - Owns its data domain completely

**CV-Command Service** (for write operations):
- **Purpose**: Manages CV creation and modification as business entities
- **Characteristics**:
  - Entity-centric service focused on write operations
  - Implements event sourcing for entity changes
  - Enforces business rules for CV structure
  - Maintains audit trail of entity modifications

**CV-Query Service** (for read operations):
- **Purpose**: Provides read access to CV entities
- **Characteristics**:
  - Entity-centric service focused on read operations
  - Builds and maintains projections from event stream
  - Optimizes data for read performance
  - Supports versioned entity views

#### Utility Services
Utility services provide cross-cutting application functions:

**Auth Service**:
- **Purpose**: Provides authentication and authorization capabilities
- **Characteristics**:
  - Function-centric service with cross-cutting concerns
  - Highly reusable across multiple applications
  - Implements security standards like JWT
  - Can be used by multiple business processes

**Template Service** (planned for future):
- **Purpose**: Provides CV template management
- **Characteristics**:
  - Function-centric service for template processing
  - Reusable design components
  - Separation from business entity logic

#### Microservices
Microservices provide specialized, independently deployable functions:

**CV-Command Service** (implementation perspective):
- **Purpose**: Handles CV write operations with high autonomy
- **Characteristics**:
  - Highly autonomous deployment
  - Specialized for write scalability
  - Independent database for event storage
  - Specific scaling requirements for write operations

**CV-Query Service** (implementation perspective):
- **Purpose**: Handles CV read operations with high autonomy
- **Characteristics**:
  - Highly autonomous deployment
  - Specialized for read scalability
  - Independent database for projections
  - Different scaling profile than write operations

### Service Capability Details

#### Auth Service
- Process user registration with email and password
- Authenticate user login and issue JWT tokens
- Secure password storage with hashing algorithms
- Validate JWT tokens for protected operations

#### User Service
- Store and retrieve user profile information
- Manage user biographical data (name, avatar, bio)
- Associate profiles with authenticated users
- Update user profile details

#### CV-Command Service
- Process CV creation with title and template selection
- Handle section addition to existing CVs
- Process section update operations
- Manage section removal requests
- Support CV renaming operations
- Handle template changes
- Sign and store events in the event store
- Provide undo capability for recent operations *(Note: Undo functionality is currently in development)*

#### CV-Query Service
- Read events from event store
- Rebuild CV projections from event stream
- Serve current CV state to clients
- Support versioned CV views *(Note: Version rollback feature is currently in development)*
- Maintain optimized read models

#### Gateway Service
- Route incoming requests to appropriate services
- Forward authentication headers to services
- Centralize API endpoint access
- Provide uniform interface to clients

#### Frontend Application
- Present intuitive user interface
- Offer block-based CV editor
- Show real-time CV preview with templates
- Handle user authentication flows
- Communicate with backend via Gateway

### Service Interactions

#### User Authentication Flow
1. Frontend collects credentials
2. Gateway routes authentication request to Auth Service
3. Auth Service validates credentials and issues JWT
4. Frontend stores JWT for subsequent requests

#### User Profile Management Flow
1. Frontend sends profile data with JWT
2. Gateway validates JWT and routes to User Service
3. User Service creates or updates profile
4. User Service returns updated profile data

#### CV Creation Flow
1. Frontend sends CV creation request with JWT
2. Gateway routes request to CV-Command Service
3. CV-Command Service validates request
4. CV-Command Service emits CV_CREATED event
5. CV-Command Service returns success response

#### CV Editing Flow
1. Frontend sends section modification with JWT
2. Gateway routes to CV-Command Service
3. CV-Command Service emits appropriate event (SECTION_ADDED, SECTION_UPDATED, etc.)
4. Event is stored in the event store with signature
5. CV-Query Service detects new event
6. CV-Query Service updates its projection

#### CV Viewing Flow
1. Frontend requests CV data with JWT
2. Gateway routes to CV-Query Service
3. CV-Query Service retrieves projection
4. CV-Query Service returns CV data to client

### Data Ownership

#### Auth Service
- Owns: `users` collection
  - User credentials (email, hashed password)

#### User Service
- Owns: `profiles` collection
  - User profile data (userId, fullName, avatarUrl, bio)

#### CV-Command Service
- Owns: `events` collection
  - Event records (eventType, cvId, userId, payload, timestamp, signature)

#### CV-Query Service
- Owns: `cvs` collection (projection)
  - CV projections (cvId, userId, title, templateId, blocks)

## 4. API Specs

Complete API specifications are available in the following files:
- Auth Service API: `docs/api-specs/auth-service.yaml`
- User Service API: `docs/api-specs/user-service.yaml`
- CV-Command Service API: `docs/api-specs/cv-command-service.yaml`
- CV-Query Service API: `docs/api-specs/cv-query-service.yaml`

---

**Team Members**:
- Trần Thái Bình Minh – B21DCVT034
- Hoàng Trọng Khôi - B21DCVT026
- Nguyễn Đình Minh - B21DCCN086

---
````
