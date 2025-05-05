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

## 2. 🧩 Service-Oriented Analysis

### Main Process Steps
1. **User Account Management**:
   - User registration and authentication with email/password
   - JWT token issuance for security
   - Profile management for personal information

2. **CV Creation and Management**:
   - New CV creation with title and template selection
   - Unique identifier assignment for each CV
   - CV creation events recording with timestamps and signatures
   - User's CV listing and selection

3. **CV Content Editing**:
   - Adding various section blocks (personal info, education, experience)
   - Updating existing section content
   - Removing unwanted sections
   - Renaming CV titles and changing templates
   - Capturing each change as a discrete signed event

4. **Version Management**:
   - Logging content change events with timestamps
   - Storing events with cryptographic signatures for integrity
   - Reconstructing CV state from event stream
   - Enabling undo functionality for recent changes *(Note: Undo and version rollback features are currently in development and not yet functional)*

5. **CV Access and Viewing**:
   - Viewing CVs with applied templates
   - Accessing CVs via unique URLs

### Entities Involved
- Users (authentication credentials)
- User Profiles (personal information)
- CVs (metadata and structure)
- CV Sections/Blocks (content components)
- Events (change history)
- Templates (formatting options)

### Microservices Drivers
- **Separation**: Different aspects of the system have distinct responsibilities
- **Scalability Requirements**: Different components may need to scale independently
- **Domain Complexity**: CV editing and versioning logic is complex and benefits from isolation
- **Read/Write Pattern Differences**: Command operations (edits) and query operations (views) have different patterns
- **Data Integrity**: Full audit trail required for all changes

## 3. 🔄 Service-Oriented Design

### Service Candidates

1. **Auth Service**:
   - Responsibility: Handles user authentication and security
   - Functions: User registration, login, and JWT token management

2. **User Service**:
   - Responsibility: Manages user profile information
   - Functions: Store, retrieve, and update user biographical data

3. **CV-Command Service**:
   - Responsibility: Processes all CV write operations as events
   - Functions: Create CVs, manage sections, handle template changes, store event history

4. **CV-Query Service**:
   - Responsibility: Handles read operations for CVs
   - Functions: Reconstruct CVs from events, serve current CV state to clients

5. **Gateway Service**:
   - Responsibility: Routes client requests to appropriate backend services
   - Functions: API routing, authentication header forwarding, centralized endpoint access

6. **Frontend Application**:
   - Responsibility: Provides the user interface
   - Functions: CV editor, template preview, authentication UI

### Service Capabilities

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