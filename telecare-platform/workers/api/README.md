# Telecare Platform API Worker

A Cloudflare Worker API for the Telecare Platform, providing backend services for medical case management, user authentication, file uploads, and translation services.

## 🚀 Deployment

**Production URL**: `https://telecare-platform-api-prod.omariosc101.workers.dev`

## 📋 API Endpoints

### Health Check
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/db` - Database health check
- `GET /api/v1/health/storage` - R2 storage health check
- `GET /api/v1/health/cache` - KV cache health check
- `GET /api/v1/health/full` - Comprehensive health check

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user profile

### Users
- `GET /api/v1/users` - List users (with filtering)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user profile

### Medical Cases
- `GET /api/v1/cases` - List medical cases
- `POST /api/v1/cases` - Create new case
- `GET /api/v1/cases/:id` - Get case details
- `PUT /api/v1/cases/:id` - Update case
- `GET /api/v1/cases/:id/responses` - Get case responses
- `POST /api/v1/cases/:id/responses` - Add case response

### File Management
- `POST /api/v1/files/upload` - Upload file to R2 storage
- `GET /api/v1/files/download/:key` - Download file from R2
- `DELETE /api/v1/files/:key` - Delete file from R2

### Translation
- `POST /api/v1/translation/translate` - Translate text
- `GET /api/v1/translation/languages` - Get supported languages

## 🔧 Environment Variables

- `ENVIRONMENT` - Environment name (development/production)
- `API_VERSION` - API version (v1)
- `ALLOWED_ORIGINS` - CORS allowed origins

## 🗄️ Database Integration

The Worker connects to:
- **D1 Database**: `telecare-platform-prod` for data storage
- **KV Namespace**: For caching and session storage
- **R2 Bucket**: `telecare-platform-storage-prod` for file storage

## 📝 API Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string,
  "timestamp": string
}
```

## 🔐 Authentication

API uses Bearer token authentication:

```bash
curl -H "Authorization: Bearer <token>" \
     https://telecare-platform-api-prod.omariosc101.workers.dev/api/v1/auth/me
```

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod
```

### Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm test
```

## 🌐 CORS Configuration

The API supports CORS for:
- `https://telecare-platform.pages.dev`
- `https://6f806039.telecare-platform.pages.dev`
- `http://localhost:3000` (development)

## 📊 Monitoring

Monitor the Worker through:
- Cloudflare Dashboard → Workers & Pages → telecare-platform-api-prod
- Health check endpoints for service status
- Logs in Wrangler CLI: `wrangler tail --env production`

## 🚀 Integration with Pages

The Pages frontend integrates with this Worker API:

```javascript
// Example API call from Pages
const response = await fetch('https://telecare-platform-api-prod.omariosc101.workers.dev/api/v1/health');
const data = await response.json();
```

## 🔗 Related Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [R2 Storage](https://developers.cloudflare.com/r2/)

## 📈 Performance

- **Startup Time**: ~5ms
- **Upload Size**: 212KB (39.55KB gzipped)
- **Global Edge Deployment**: Available worldwide via Cloudflare's edge network
- **Zero Cold Starts**: Always-warm execution environment