# API Endpoints Documentation

## Overview
The application uses Next.js App Router API routes with a RESTful design pattern. All endpoints are organized under `/api/` and follow standard HTTP methods.

## Authentication Endpoints

### POST `/api/auth/login`
**Purpose**: User authentication and login
- **Body**: `{ email: string, password: string }`
- **Response**: JWT token and user data
- **Status Codes**: 
  - `200`: Success
  - `400`: Missing credentials
  - `401`: Invalid credentials
- **Authentication**: None required

### POST `/api/auth/register`
**Purpose**: New user registration
- **Body**: `{ name: string, email: string, password: string }`
- **Response**: User data and JWT token
- **Status Codes**: 
  - `201`: User created
  - `400`: Validation errors
  - `409`: Email already exists
- **Authentication**: None required

### GET `/api/auth/me`
**Purpose**: Get current user profile
- **Response**: Current user data
- **Status Codes**: 
  - `200`: Success
  - `401`: Not authenticated
- **Authentication**: JWT token required

### POST `/api/auth/logout`
**Purpose**: User logout (token invalidation)
- **Response**: Success message
- **Status Codes**: `200`: Success
- **Authentication**: JWT token required

## Content Management Endpoints

### Projects API (`/api/projects`)

#### GET `/api/projects`
- **Purpose**: Fetch all projects
- **Query Parameters**: None
- **Response**: Array of project objects
- **Authentication**: None required
- **Sorting**: By creation date (newest first)

#### POST `/api/projects`
- **Purpose**: Create new project
- **Body**: 
  ```json
  {
    "title": "string",
    "description": "string", 
    "collaborators": "string",
    "banner": "string",
    "videoUrl": "string",
    "isPreview": "boolean"
  }
  ```
- **Response**: Created project object
- **Authentication**: JWT token required
- **User Association**: Automatically linked to authenticated user

#### PUT `/api/projects?id={projectId}`
- **Purpose**: Update existing project
- **Query**: `id` parameter required
- **Body**: Project update fields
- **Response**: Updated project object
- **Authentication**: JWT token required
- **Authorization**: User must own the project

#### DELETE `/api/projects?id={projectId}`
- **Purpose**: Delete project
- **Query**: `id` parameter required
- **Response**: Success message
- **Authentication**: JWT token required
- **Authorization**: User must own the project

### Research Papers API (`/api/research-papers`)

#### GET `/api/research-papers`
- **Purpose**: Fetch all research papers
- **Response**: Array of research paper objects
- **Sorting**: By publication date

#### POST `/api/research-papers`
- **Body**:
  ```json
  {
    "title": "string",
    "abstract": "string",
    "pdfUrl": "string",
    "publishedAt": "ISO date string",
    "isPreview": "boolean"
  }
  ```
- **Authentication**: JWT token required

#### PUT/DELETE `/api/research-papers?id={paperId}`
- **Similar pattern to projects API**
- **Authentication**: JWT token required

### Conferences API (`/api/conferences`)

#### GET `/api/conferences`
- **Purpose**: Fetch all conferences
- **Response**: Array of conference objects

#### POST `/api/conferences`
- **Body**:
  ```json
  {
    "name": "string",
    "location": "string",
    "date": "ISO date string",
    "paperPresented": "boolean",
    "isPreview": "boolean"
  }
  ```
- **Authentication**: JWT token required

### Achievements API (`/api/achievements`)

#### GET `/api/achievements`
- **Purpose**: Fetch all achievements
- **Response**: Array of achievement objects

#### POST `/api/achievements`
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "date": "ISO date string",
    "isPreview": "boolean"
  }
  ```
- **Authentication**: JWT token required

### Blog Posts API (`/api/blogs`)

#### GET `/api/blogs`
- **Purpose**: Fetch all blog posts
- **Response**: Array of blog post objects

#### POST `/api/blogs`
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "imageUrl": "string",
    "isPreview": "boolean"
  }
  ```
- **Authentication**: JWT token required

## User and Portfolio Management

### GET `/api/user/[id]`
**Purpose**: Get specific user's public profile data
- **Path Parameter**: User ID
- **Response**: User profile and portfolio data
- **Authentication**: None required (public endpoint)
- **Data Filtering**: Only published/public data returned

### GET `/api/portfolio/[id]`
**Purpose**: Get user's complete portfolio data
- **Path Parameter**: User ID  
- **Response**: Complete user portfolio with all sections
- **Authentication**: None required
- **Usage**: Used by preview system

### GET `/api/preview/[id]`
**Purpose**: Get portfolio preview data
- **Path Parameter**: User ID
- **Response**: Portfolio data for preview rendering
- **Authentication**: None required
- **Real-time**: Used by admin preview system

### POST `/api/publish`
**Purpose**: Toggle portfolio publication status
- **Body**: `{ isPublished: boolean }`
- **Response**: Updated publication status
- **Authentication**: JWT token required

## Development Endpoints

### POST `/api/dev/add-password-column`
**Purpose**: Database migration utility (development only)
- **Usage**: One-time migration for password column
- **Authentication**: Development environment only

## Common Response Patterns

### Success Response Format
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### Status Codes Used
- `200`: OK - Successful GET/PUT requests
- `201`: Created - Successful POST requests
- `400`: Bad Request - Validation errors
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists
- `500`: Internal Server Error - Server errors

## Authentication & Authorization

### JWT Token Structure
- **Header**: Bearer token in Authorization header
- **Payload**: User ID and session information
- **Expiration**: Configurable token lifetime

### Protected Routes
All content management endpoints (POST, PUT, DELETE) require authentication:
- Projects API
- Research Papers API  
- Conferences API
- Achievements API
- Blog Posts API
- User profile updates
- Portfolio publishing

### Public Routes
- Authentication endpoints (login/register)
- Public portfolio views
- Preview endpoints
- GET endpoints for content (filtered for public data)

## Rate Limiting
- **Implementation**: Currently not implemented
- **Recommendation**: Consider implementing for production
- **Suggested Limits**: 
  - Authentication: 5 attempts per minute
  - Content creation: 60 requests per hour
  - Public views: 1000 requests per hour

## Error Handling
- **Database Errors**: Caught and returned as 500 status
- **Validation Errors**: Returned as 400 status with details
- **Authentication Errors**: Consistent 401 responses
- **Logging**: Server-side error logging with console.error

## CORS Configuration
- **Origin**: Configured for development and production domains
- **Methods**: GET, POST, PUT, DELETE
- **Headers**: Content-Type, Authorization