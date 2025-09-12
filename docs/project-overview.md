# Project Overview

## Next.js Portfolio Builder Platform

### Description
A comprehensive no-code portfolio-building platform that enables users to create professional portfolios with real-time preview capabilities. Built with modern web technologies and powered by AI assistance.

### Key Features
- **Real-time Live Preview**: Instant updates while building portfolios
- **No-Code Interface**: Users only need to provide text content
- **Multi-User Support**: Individual user accounts and portfolios
- **Admin Dashboard**: Comprehensive admin panel for portfolio management
- **Customizable Themes**: Theme customization with primary colors
- **Section Management**: Flexible section ordering and visibility controls
- **Publishing System**: Portfolio publishing and sharing capabilities

### Tech Stack

#### Frontend
- **Next.js 15.1.6**: React framework with app router
- **React 19.0.0**: Latest React version
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **DaisyUI 4.12.23**: Tailwind CSS component library
- **Lucide React**: Icon library
- **React Icons**: Additional icon library
- **React Hot Toast**: Toast notifications

#### Backend & Database
- **PostgreSQL**: Primary database hosted on NeonDB
- **Drizzle ORM 0.39.2**: TypeScript ORM
- **Drizzle Kit 0.30.4**: Database migrations and management
- **@neondatabase/serverless**: Neon database client

#### Authentication & Security
- **bcryptjs**: Password hashing
- **jsonwebtoken & jose**: JWT token handling
- **server-only**: Server-side only imports

#### Development Tools
- **TypeScript support**: Type definitions included
- **ESLint**: Code linting with Next.js config
- **PostCSS**: CSS processing

### Project Structure
```
src/
├── app/
│   ├── admin/           # Admin dashboard and components
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── login/           # Login page
│   ├── portfolio/       # Portfolio pages
│   └── preview/         # Preview functionality
├── contexts/            # React contexts
├── utils/               # Utility functions and database schema
└── components/          # Reusable components
```

### Target Users
- Researchers and academics
- Professionals building portfolios
- Students showcasing projects
- Anyone needing a professional online presence

### Deployment
- Development: `npm run dev`
- Production build: `npm run build`
- Production start: `npm start`
- Database operations: `npm run db:push`, `npm run db:studio`