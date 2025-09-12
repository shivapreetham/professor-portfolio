# Database Schema Documentation

## Overview
The application uses PostgreSQL with Drizzle ORM for database operations. The schema supports multi-user portfolios with comprehensive content management.

## Core Tables

### Users Table (`user`)
Primary user information and portfolio settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique user identifier (CUID2) |
| name | varchar(100) | NOT NULL | User's display name |
| email | varchar(100) | NOT NULL, UNIQUE | User's email address |
| password | varchar(255) | NOT NULL | Hashed password |
| profileImage | varchar(255) | | Profile image URL |
| bio | text | | User biography |
| location | varchar(100) | | User's location |
| linkedIn | varchar(255) | | LinkedIn profile URL |
| theme | varchar(50) | DEFAULT 'light' | Portfolio theme (light/dark) |
| primaryColor | varchar(50) | DEFAULT 'blue' | Primary color scheme |
| customCSS | text | | Custom CSS styles |
| heroTitle | text | | Portfolio hero section title |
| heroSubtitle | text | | Portfolio hero section subtitle |
| sectionsOrder | text | | JSON string of section ordering |
| sectionVisibility | text | | JSON string of section visibility |
| isPublished | boolean | DEFAULT false | Portfolio publication status |
| createdAt | timestamp | DEFAULT now() | Account creation time |
| updatedAt | timestamp | DEFAULT now() | Last update time |

### Projects Table (`projects`)
User's project portfolio items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique project identifier |
| userId | text | NOT NULL, FK(user.id) | Owner user ID |
| collaborators | text | | Project collaborators |
| title | varchar(200) | NOT NULL | Project title |
| description | text | NOT NULL | Project description |
| banner | varchar(255) | | Project banner image URL |
| videoUrl | varchar(255) | | Project demo video URL |
| isPreview | boolean | DEFAULT true | Preview mode flag |
| createdAt | timestamp | DEFAULT now() | Creation timestamp |

### Research Papers Table (`research_papers`)
Academic publications and research work.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique paper identifier |
| userId | text | NOT NULL, FK(user.id) | Author user ID |
| title | varchar(200) | NOT NULL | Paper title |
| abstract | text | NOT NULL | Paper abstract |
| pdfUrl | varchar(255) | | PDF document URL |
| publishedAt | timestamp | NOT NULL | Publication date |
| isPreview | boolean | DEFAULT true | Preview mode flag |

### Conferences Table (`conferences`)
Conference presentations and participation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique conference identifier |
| userId | text | NOT NULL, FK(user.id) | Participant user ID |
| name | varchar(200) | NOT NULL | Conference name |
| location | varchar(200) | | Conference location |
| date | timestamp | NOT NULL | Conference date |
| paperPresented | boolean | DEFAULT false | Paper presentation flag |
| isPreview | boolean | DEFAULT true | Preview mode flag |

### Achievements Table (`achievements`)
User accomplishments and milestones.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique achievement identifier |
| userId | text | NOT NULL, FK(user.id) | User ID |
| title | varchar(200) | NOT NULL | Achievement title |
| description | text | NOT NULL | Achievement description |
| date | timestamp | NOT NULL | Achievement date |
| isPreview | boolean | DEFAULT true | Preview mode flag |

### Blog Posts Table (`blog_posts`)
User blog posts and articles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique blog post identifier |
| userId | text | NOT NULL, FK(user.id) | Author user ID |
| title | varchar(200) | NOT NULL | Post title |
| content | text | NOT NULL | Post content |
| imageUrl | varchar(255) | | Featured image URL |
| isPreview | boolean | DEFAULT true | Preview mode flag |
| createdAt | timestamp | DEFAULT now() | Creation timestamp |

### Teaching Experience Table (`teaching_experience`)
Academic teaching positions and experience.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique experience identifier |
| userId | text | NOT NULL, FK(user.id) | Teacher user ID |
| subject | varchar(200) | NOT NULL | Subject taught |
| institution | varchar(200) | NOT NULL | Institution name |
| startDate | timestamp | NOT NULL | Position start date |
| endDate | timestamp | | Position end date (null if current) |

### Awards Table (`awards`)
Honors and awards received.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique award identifier |
| userId | text | NOT NULL, FK(user.id) | Recipient user ID |
| title | varchar(200) | NOT NULL | Award title |
| organization | varchar(200) | NOT NULL | Awarding organization |
| date | timestamp | NOT NULL | Award date |

### Collaborations Table (`collaborations`)
Professional collaborations and partnerships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY | Unique collaboration identifier |
| userId | text | NOT NULL, FK(user.id) | User ID |
| collaboratorName | varchar(200) | NOT NULL | Collaborator name |
| institution | varchar(200) | | Collaborator institution |
| projectTitle | varchar(200) | NOT NULL | Collaboration project title |
| startDate | timestamp | NOT NULL | Collaboration start date |
| endDate | timestamp | | Collaboration end date |

## Relationships

### One-to-Many Relationships
- **user** → **projects**: One user can have multiple projects
- **user** → **researchPapers**: One user can have multiple research papers
- **user** → **conferences**: One user can participate in multiple conferences
- **user** → **achievements**: One user can have multiple achievements
- **user** → **blogPosts**: One user can write multiple blog posts
- **user** → **teachingExperience**: One user can have multiple teaching positions
- **user** → **awards**: One user can receive multiple awards
- **user** → **collaborations**: One user can have multiple collaborations

## Database Configuration
- **ORM**: Drizzle ORM with PostgreSQL driver
- **Hosting**: NeonDB (serverless PostgreSQL)
- **Migration**: Drizzle Kit for schema migrations
- **Connection**: @neondatabase/serverless client

## Common Patterns
- All tables use CUID2 for primary keys
- All content tables have `userId` foreign key with cascade delete
- Most content tables include `isPreview` flag for draft/published states
- Timestamps use PostgreSQL timestamp type with timezone support
- Text fields are unlimited length, varchar fields have specified limits