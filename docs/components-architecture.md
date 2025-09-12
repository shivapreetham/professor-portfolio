# Components Architecture Documentation

## Overview
The application follows a modular component architecture with clear separation of concerns between admin functionality, preview system, and content management.

## Core Application Structure

### Main Application Layout
```
src/app/
├── layout.jsx          # Root layout with global providers
├── page.jsx            # Landing/home page
├── globals.css         # Global styles
└── [routes]/           # Page-based routing
```

## Admin Dashboard Components

### 1. AdminPage (`/admin/page.jsx`)
**Purpose**: Main admin dashboard orchestrator
- **Layout**: 3-column grid layout (sidebar, content, preview)
- **Authentication**: Protected route with auth validation
- **Components**:
  - `CustomizationSidebar`: Theme and visual customization
  - `FormContent`: Main content editing area
  - `MobilePreview`: Real-time preview pane

### 2. FormContent (`/admin/components/FormContent.jsx`)
**Purpose**: Content management coordinator
- **Structure**: Vertical sections with dividers
- **Sections Managed**:
  - Personal Information (`BasicDetails`)
  - Projects (`ProjectSection`)
  - Research Papers (`ResearchPaperSection`)
  - Conferences (`ConferenceSection`)
  - Blog Posts (`BlogSection`)
  - Achievements (`AchievementsSection`)
- **Features**:
  - Dynamic section loading
  - User data validation
  - Publish controls integration

### 3. MobilePreview (`/admin/components/MobilePreview.jsx`)
**Purpose**: Real-time portfolio preview
- **Technology**: iframe-based preview system
- **Features**:
  - Auto-refresh on data changes
  - Mobile-responsive preview
  - Loading states
  - Dynamic URL generation based on user ID
- **Integration**: Connected to DataSync context for real-time updates

### 4. CustomizationSidebar (`/admin/components/CustomizationSidebar.jsx`)
**Purpose**: Theme and visual customization panel
- **Functionality**:
  - Theme selection (light/dark)
  - Primary color customization
  - Section visibility controls
  - Section ordering management
  - Custom CSS injection

## Content Section Components

### Project Management
```
/admin/components/addSections/Project/
├── ProjectSection.jsx      # Main project container
├── AddProject.jsx          # Project creation form
├── ProjectListEdit.jsx     # Project list with edit controls
└── useProject.jsx          # Project state management hook
```

### Research Papers Management
```
/admin/components/addSections/ResearchPapers/
├── researchPaperSection.jsx    # Main research container
├── addResearchPaper.jsx        # Paper creation form
├── researchPaperListEdit.jsx   # Paper list with edit controls
└── useResearchPapers.jsx       # Research papers state hook
```

### Conferences Management
```
/admin/components/addSections/conferances/
├── conferanceSection.jsx   # Main conference container
├── addConferance.jsx       # Conference creation form
├── conferanceList.jsx      # Conference list display
└── useConferance.jsx       # Conference state management hook
```

### Blog Management
```
/admin/components/addSections/blogs/
├── blogSection.jsx         # Main blog container
├── addBlogPost.jsx         # Blog post creation form
├── blogPostList.jsx        # Blog post list display
└── useBlogPosts.jsx        # Blog posts state management hook
```

### Achievements Management
```
/admin/components/addSections/achievements/
├── achievementSection.jsx      # Main achievement container
├── addAchievement.jsx          # Achievement creation form
├── achievementListEdit.jsx     # Achievement list with edit controls
└── useAchievement.jsx          # Achievement state management hook
```

## Common Patterns

### 1. Section Component Pattern
Each content section follows a consistent pattern:
- **Container Component**: Main section wrapper
- **Add Component**: Form for creating new items
- **List Component**: Display and edit existing items
- **Custom Hook**: State management and API calls

### 2. Form Components
- **Consistent styling**: DaisyUI components
- **Validation**: Client-side form validation
- **Loading states**: Loading indicators during API calls
- **Error handling**: Toast notifications for errors

### 3. State Management Hooks
Each section uses custom hooks for:
- **Data fetching**: API calls to backend
- **Local state**: Form state and UI state
- **Mutations**: Create, update, delete operations
- **Cache management**: Optimistic updates

## Shared Components

### UI Components
```
/components/ui/
├── loading.jsx             # Loading spinners and skeletons
├── button.jsx              # Styled button components
├── input.jsx               # Form input components
└── modal.jsx               # Modal dialogs
```

### Context Providers
```
/contexts/
├── AuthContext.jsx         # User authentication state
├── DataSyncContext.jsx     # Real-time data synchronization
└── ThemeContext.jsx        # Theme and customization state
```

## Preview System

### Preview Page (`/preview/[id]/page.jsx`)
**Purpose**: Public portfolio display
- **Dynamic routing**: User ID-based URLs
- **Server-side rendering**: SEO-friendly portfolio pages
- **Theme application**: User's custom theme and colors
- **Section rendering**: Dynamic section display based on visibility settings

### Preview Components
- **Responsive design**: Mobile-first approach
- **Theme integration**: Dynamic CSS variable application
- **Section components**: Matching admin section displays
- **Performance optimized**: Minimal JavaScript for fast loading

## Integration Points

### Data Flow
1. **Admin Input** → FormContent components
2. **State Management** → Custom hooks
3. **API Calls** → Backend endpoints
4. **Database Update** → PostgreSQL via Drizzle ORM
5. **Preview Update** → iframe refresh via DataSync
6. **Public Display** → Preview page rendering

### Authentication Flow
1. **Login** → Auth API endpoint
2. **Token Storage** → Local storage/cookies
3. **Context Update** → AuthContext provider
4. **Route Protection** → Admin page guards
5. **API Authorization** → JWT token validation

### Real-time Updates
1. **Form Changes** → Local state update
2. **API Save** → Database persistence
3. **DataSync Trigger** → Preview refresh signal
4. **iframe Reload** → Updated preview display

## Performance Considerations

### Optimization Strategies
- **Component lazy loading**: Dynamic imports for heavy components
- **Debounced saves**: Prevent excessive API calls during typing
- **Optimistic updates**: Immediate UI feedback
- **Image optimization**: Next.js image component usage
- **Bundle splitting**: Page-based code splitting

### Caching
- **Browser caching**: Static assets and API responses
- **Database queries**: Efficient query patterns
- **Preview generation**: Server-side caching of rendered portfolios