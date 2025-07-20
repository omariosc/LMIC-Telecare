# Database Setup Guide

This guide explains how to set up the Cloudflare D1 database for the Telecare Platform.

## Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account with access to Workers and D1 database
2. **Wrangler CLI**: Installed as a dev dependency in this project
3. **Authentication**: Logged into Cloudflare via wrangler

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Login to Cloudflare
```bash
npm run cf:login
```

### 3. Setup Database (Automated)
```bash
# For development environment
node scripts/setup-database.js dev

# For staging environment  
node scripts/setup-database.js staging

# For production environment
node scripts/setup-database.js prod
```

This script will:
- Create the D1 database
- Update `wrangler.toml` with the database ID
- Run all migrations
- Seed the database with sample data
- Verify the setup

## Manual Setup

If you prefer to set up manually:

### 1. Create Database
```bash
# Development
npm run db:create

# Staging
npm run db:create:staging

# Production
npm run db:create:prod
```

### 2. Update Configuration
After creating the database, update the `database_id` in `wrangler.toml` with the ID returned by the create command.

### 3. Run Migrations
```bash
# Development
npm run db:migrate
npm run db:seed

# Or combined
npm run db:reset

# Staging
npm run db:migrate:staging
npm run db:seed:staging

# Production
npm run db:migrate:prod
```

## Database Schema

The database includes the following main tables:

### Core Tables
- **users**: User accounts and profiles
- **user_sessions**: Authentication sessions
- **medical_cases**: Medical cases/consultations
- **case_responses**: Responses to medical cases
- **case_assignments**: Specialist assignments to cases

### Supporting Tables
- **file_uploads**: File attachment management
- **notifications**: User notifications
- **user_achievements**: Gamification and recognition
- **translation_cache**: Cached translations
- **audit_log**: Action logging for security
- **system_settings**: Application configuration

## Sample Data

The seed data includes:
- 9 dummy users (3 Gaza clinicians, 5 UK specialists, 1 admin)
- 5 sample medical cases across different specialties
- Case responses and assignments
- Notifications and achievements

### Sample Users
- **Gaza Clinicians**: ahmad@gaza-health.ps, fatima@gaza-health.ps, omar@gaza-health.ps
- **UK Specialists**: dr.smith@nhs.uk, dr.johnson@nhs.uk, dr.patel@nhs.uk, dr.wilson@nhs.uk, dr.brown@nhs.uk
- **Admin**: admin@telecare-platform.org

## Development Commands

```bash
# View database tables
npm run db:console

# Reset database (drop and recreate)
npm run db:reset

# Execute custom SQL
npx wrangler d1 execute telecare-platform-dev --command="SELECT * FROM users LIMIT 5;"

# Execute SQL file
npx wrangler d1 execute telecare-platform-dev --file=./custom-migration.sql
```

## Database Helper Usage

The project includes a TypeScript database helper class:

```typescript
import { DatabaseHelper } from '@/lib/database';

// In your Cloudflare Worker or API route
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = new DatabaseHelper(env.DB);
    
    // Create a user
    const user = await db.createUser({
      email: 'doctor@example.com',
      first_name: 'Dr.',
      last_name: 'Example',
      role: 'uk_specialist',
      specialties: ['cardiology']
    });
    
    // Get cases
    const { cases } = await db.getCases({
      specialty: 'cardiology',
      status: ['open'],
      limit: 10
    });
    
    return Response.json({ user, cases });
  }
};
```

## Environment Variables

Make sure these are set in your Cloudflare environment:

```bash
# In wrangler.toml
DB = "your-database-binding"
STORAGE = "your-r2-bucket-binding"  
CACHE = "your-kv-namespace-binding"
```

## Troubleshooting

### Authentication Issues
```bash
# Re-authenticate
npm run cf:login

# Check current user
npx wrangler auth whoami
```

### Database Issues
```bash
# List databases
npx wrangler d1 list

# Check database info
npx wrangler d1 info telecare-platform-dev

# View recent queries (if logging enabled)
npx wrangler d1 execute telecare-platform-dev --command="SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 10;"
```

### Migration Issues
- Ensure migration files are valid SQL
- Check for syntax errors in schema
- Verify foreign key constraints
- Make sure all required fields have default values

## Security Considerations

1. **Production Data**: Never use seed data in production
2. **Access Control**: Limit database access to necessary environments
3. **Audit Logging**: All database changes are logged in `audit_log`
4. **Data Validation**: Use the TypeScript interfaces for type safety
5. **Backup**: Cloudflare handles backups, but consider additional backup strategies for critical data

## Next Steps

After database setup:

1. Configure R2 storage for file uploads
2. Set up KV for caching
3. Configure environment variables
4. Deploy the application
5. Test database connectivity

For more information, see:
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Project API Documentation](./api-reference.md)