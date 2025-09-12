# Setup and Development Guide

## Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- PostgreSQL database (NeonDB account recommended)
- Git for version control

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd webteamproject
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# Authentication
JWT_SECRET="your-jwt-secret-key-here"

# Optional: Development settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

#### NeonDB Setup
1. Create account at [neon.tech](https://neon.tech)
2. Create new project and database
3. Copy connection string to `DATABASE_URL`
4. Set `DIRECT_URL` to the same connection string

### 4. Database Setup
```bash
# Push schema to database
npm run db:push

# Optional: Open database studio
npm run db:studio
```

### 5. Start Development Server
```bash
npm run dev
```

Access the application at `http://localhost:3000`

## Development Commands

### Package Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

### Database Operations
```bash
# Generate migrations
npx drizzle-kit generate:pg

# Push schema changes
npx drizzle-kit push:pg

# View database in browser
npx drizzle-kit studio
```

## Project Structure

```
webteamproject/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── preview/           # Portfolio preview
│   │   └── ...
│   ├── components/            # Reusable components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility libraries
│   └── utils/                 # Database and utilities
├── public/                    # Static assets
├── docs/                      # Project documentation
├── migrations/                # Database migrations
└── ...config files
```

## Admin Access

### Default Admin Credentials
- **URL**: `/admin`
- **Username**: admin
- **Password**: password123

*Note: Change these credentials in production*

## Development Workflow

### 1. Making Database Changes
1. Update `src/utils/schema.js`
2. Run `npm run db:push`
3. Test changes in development
4. Commit schema changes

### 2. Adding New Features
1. Create feature branch
2. Develop components in appropriate directories
3. Add API endpoints if needed
4. Test functionality
5. Update documentation
6. Create pull request

### 3. Component Development
- Use DaisyUI for UI components
- Follow existing component patterns
- Add TypeScript types where applicable
- Test responsive design

## Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- `DATABASE_URL`: Production database connection
- `JWT_SECRET`: Strong, unique JWT secret
- `NEXT_PUBLIC_APP_URL`: Production domain

### Build Process
```bash
npm run build
npm run start
```

### Deployment Platforms
**Recommended**: Vercel (optimal for Next.js)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

**Alternative**: Docker deployment
1. Create Dockerfile
2. Build container
3. Deploy to cloud platform

## Common Issues and Solutions

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check NeonDB connection limits
- Ensure SSL mode is enabled

### Authentication Problems
- Verify `JWT_SECRET` is set
- Check token expiration settings
- Clear browser storage for development

### Build Failures
- Run `npm run lint` to check for errors
- Verify all dependencies are installed
- Check for TypeScript errors

### Performance Issues
- Use Next.js Image component for images
- Implement proper loading states
- Consider database query optimization

## Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Admin dashboard functionality
- [ ] Portfolio creation and editing
- [ ] Real-time preview updates
- [ ] Theme customization
- [ ] Portfolio publishing
- [ ] Public portfolio viewing
- [ ] Mobile responsiveness

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Contributing Guidelines

### Code Style
- Follow existing code formatting
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

### Git Workflow
1. Create feature branches from main
2. Use descriptive commit messages
3. Test before committing
4. Update documentation as needed

### Pull Request Process
1. Fill out PR template
2. Ensure all tests pass
3. Request review from team members
4. Address feedback and merge

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Drizzle ORM](https://orm.drizzle.team/)

### Tools
- **Database**: [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)
- **Deployment**: [Vercel](https://vercel.com)
- **Database Hosting**: [NeonDB](https://neon.tech)
- **Monitoring**: Consider adding error tracking (Sentry, etc.)

## Support
For questions or issues:
1. Check existing documentation
2. Search GitHub issues
3. Create new issue with detailed description
4. Contact development team