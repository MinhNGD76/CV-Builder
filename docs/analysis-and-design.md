**Team Members**:
- Trần Thái Bình Minh – B21DCVT034
- Hoàng Trọng Khôi - B21DCVT026
- Nguyễn Đình Minh - B21DCCN086

# 📊 CV Builder System - Service-Oriented Analysis

## 1. 🎯 Business Process Description

A CV builder platform designed for professionals and job seekers to create, manage, and version control their resumes with a Google Docs-like experience. The system allows users to build professional CVs using customizable sections and export them in various templates.

**Target Users**: 
- Job seekers
- Students entering the job market
- Career professionals updating their credentials
- HR departments helping candidates prepare resumes

**Business Value**:
- Allows users to create professional CVs without design expertise
- Provides version history tracking for all changes
- Enables consistent CV formatting across templates
- Reduces time spent on CV formatting and organization

## 2. 🔄 Detailed Business Process Steps

1. **User Account Management**:
   - User registers with email and password
   - User logs in with credentials
   - System generates and issues JWT token
   - User manages personal profile information

2. **CV Creation and Management**:
   - User initiates creation of a new CV with title and template selection
   - System assigns unique identifier (cvId) to the CV
   - System records CV creation as an event with timestamp and signature
   - User can list and select from their created CVs

3. **CV Content Editing**:
   - User adds different section blocks (personal info, education, experience)
   - User updates existing content in sections
   - User removes unwanted sections
   - User renames CV title as needed
   - User changes CV template as desired
   - System captures each change as a discrete signed event

4. **Version Management**:
   - System logs each content change event with timestamp and user ID
   - Events are stored with cryptographic signatures for integrity
   - System allows reconstruction of CV state from event stream
   - User can undo recent changes as needed

5. **CV Access and Viewing**:
   - User can view their CV with applied template
   - System reconstructs CV state from stored events
   - User can access their CV via unique URL

## 3. 📋 Business Process Components Identification

Based on the detailed business process steps, we identify the following key components:

### User Management Components
- **User Authentication**: Manages user registration, login, and JWT issuance
- **User Profile Management**: Stores and updates user profile information

### CV Management Components
- **Command Processing**: Handles CV write operations (create, update, delete)
- **Event Storage**: Persists CV change events with signatures
- **Query Processing**: Reconstructs CV state from events for reading
- **Gateway Routing**: Routes requests to appropriate services

### CV Editing Components
- **Section Creation**: Adds new sections to CV
- **Section Updating**: Modifies existing section content
- **Section Removal**: Deletes sections from CV
- **CV Metadata Management**: Handles title changes and template selection

### Version Control Components
- **Event Logging**: Records all modifications as signed events
- **Event Sourcing**: Uses event stream as source of truth
- **State Reconstruction**: Rebuilds CV state from chronological events

## 4. 🧩 Service Candidate Identification

From the business process components, we identify the following service candidates that align with our architecture:

### Core Services
- **Auth Service**: Handles user authentication and security
- **User Service**: Manages user profile information
- **CV-Command Service**: Processes all CV write operations as events
- **CV-Query Service**: Handles read operations by reconstructing CV state
- **Gateway Service**: Routes client requests to appropriate backend services
- **Frontend Application**: Provides the user interface for interacting with the system

## 5. 🔍 Service Capability Analysis

For each identified service, we analyze its specific capabilities:

### Auth Service
- Process user registration with email and password
- Authenticate user login and issue JWT tokens
- Secure password storage with hashing algorithms
- Validate JWT tokens for protected operations

### User Service
- Store and retrieve user profile information
- Manage user biographical data (name, avatar, bio)
- Associate profiles with authenticated users
- Update user profile details

### CV-Command Service
- Process CV creation with title and template selection
- Handle section addition to existing CVs
- Process section update operations
- Manage section removal requests
- Support CV renaming operations
- Handle template changes
- Sign and store events in the event store
- Provide undo capability for recent operations

### CV-Query Service
- Read events from event store
- Rebuild CV projections from event stream
- Serve current CV state to clients
- Support versioned CV views
- Maintain optimized read models

### Gateway Service
- Route incoming requests to appropriate services
- Forward authentication headers to services
- Centralize API endpoint access
- Provide uniform interface to clients

### Frontend Application
- Present intuitive user interface
- Offer block-based CV editor
- Show real-time CV preview with templates
- Handle user authentication flows
- Communicate with backend via Gateway

## 6. 💼 Service Interaction Analysis

The business processes require the following service interactions:

### User Authentication Flow
1. Frontend collects credentials
2. Gateway routes authentication request to Auth Service
3. Auth Service validates credentials and issues JWT
4. Frontend stores JWT for subsequent requests

### User Profile Management Flow
1. Frontend sends profile data with JWT
2. Gateway validates JWT and routes to User Service
3. User Service creates or updates profile
4. User Service returns updated profile data

### CV Creation Flow
1. Frontend sends CV creation request with JWT
2. Gateway routes request to CV-Command Service
3. CV-Command Service validates request
4. CV-Command Service emits CV_CREATED event
5. CV-Command Service returns success response

### CV Editing Flow
1. Frontend sends section modification with JWT
2. Gateway routes to CV-Command Service
3. CV-Command Service emits appropriate event (SECTION_ADDED, SECTION_UPDATED, etc.)
4. Event is stored in the event store with signature
5. CV-Query Service detects new event
6. CV-Query Service updates its projection

### CV Viewing Flow
1. Frontend requests CV data with JWT
2. Gateway routes to CV-Query Service
3. CV-Query Service retrieves projection
4. CV-Query Service returns CV data to client

## 7. 📝 Service Contract Definition

For each service, we define its primary interface contracts:

### Auth Service
- **POST /auth/register**: Register new user with email and password
- **POST /auth/login**: Authenticate user and return JWT token

### User Service
- **POST /user/me**: Create user profile with userId, fullName, avatarUrl, bio
- **GET /user/me**: Retrieve current user profile
- **PUT /user/me**: Update user profile information

### CV-Command Service
- **POST /cv/create**: Create new CV with title and templateId
- **POST /cv/add-section**: Add new section to CV
- **POST /cv/update-section**: Update existing section
- **POST /cv/remove-section**: Remove section from CV
- **POST /cv/rename**: Change CV title
- **POST /cv/change-template**: Update CV template
- **POST /cv/undo**: Undo last change to CV
- **GET /cv/:cvId/preview**: Get reconstructed CV for preview

### CV-Query Service
- **GET /cv/:id**: Get current state of CV
- **GET /cv/:id/history**: Get event history of CV
- **GET /cv/:id/version/:versionNumber**: Get specific version of CV

### Gateway Service
- Routes all endpoint requests to appropriate services
- Passes authentication headers to protected services

## 8. 🗃️ Service Data Requirements

Each service requires specific data structures that align with our architecture:

### Auth Service
- **Collection**: `users`
- Fields:
  - `email`: string
  - `password`: hashed string

### User Service
- **Collection**: `profiles`
- Fields:
  - `userId`: string (reference to auth user)
  - `fullName`: string
  - `avatarUrl`: string
  - `bio`: string (optional)

### CV-Command Service
- **Collection**: `events`
- Fields:
  - `eventType`: string (CV_CREATED, SECTION_ADDED, etc.)
  - `cvId`: string
  - `userId`: string
  - `payload`: object (varies by event type)
  - `timestamp`: datetime
  - `signature`: string (HMAC)

### CV-Query Service
- **Collection**: `cvs` (projection)
- Fields:
  - `cvId`: string
  - `userId`: string
  - `title`: string
  - `templateId`: string
  - `blocks`: array of section objects

## 9. ✅ Service-Oriented Analysis Summary

1. **Auth Service**: Handles user registration, login, and JWT generation
2. **User Service**: Manages user profile information
3. **CV-Command Service**: Processes write operations using event sourcing
4. **CV-Query Service**: Handles read operations by building projections from events
5. **API Gateway**: Routes requests to appropriate services
6. **Frontend**: Provides user interface for the system

These services are designed to work together using:
- REST APIs for synchronous communication
- Event sourcing for CV state management and history
- JWT-based authentication for security
- Microservice architecture with separate databases
- Docker containerization for deployment

This service-oriented architecture provides:
- Separation of read and write concerns (CQRS pattern)
- Complete audit trail via event sourcing
- Scalable and maintainable microservices
- Secure and robust authentication
- Flexibility for future enhancements

---

**Team Members**:
- Trần Thái Bình Minh – B21DCVT034
- Hoàng Trọng Khôi - B21DCVT026
- Nguyễn Đình Minh - B21DCCN086

---