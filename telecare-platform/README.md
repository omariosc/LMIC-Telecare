# Telecare Platform for Gaza

A Next.js application connecting UK medical specialists with Gaza clinicians for life-saving remote
consultations.

## Developer Setup

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd telecare-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser** Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Project Structure

```
telecare-platform/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── landing/         # Landing page components
│   │   ├── layout/          # Layout components
│   │   └── shared/          # Shared/reusable components
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── public/                  # Static assets
└── package.json
```

### Development Guidelines

- Follow the TDD approach outlined in CLAUDE.md
- Use TypeScript strict mode
- Implement comprehensive test coverage
- Follow the functional programming patterns specified
- Ensure accessibility compliance

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

### Building for Production

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

### Code Quality

Ensure code quality before committing:

```bash
npm run lint
npm run typecheck
npm test
```

### Contributing

1. Follow the development guidelines in CLAUDE.md
2. Write tests for all new functionality
3. Ensure all linting and type checking passes
4. Run the full test suite before submitting changes

### Environment Configuration

The application is configured for development by default. For production deployment, ensure proper
environment variables are set according to your hosting platform requirements.

### PWA Features

This application includes Progressive Web App capabilities:

- Service worker for offline functionality
- App manifest for installation
- Optimized for mobile devices

### Architecture Notes

- Built with Next.js 14+ (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- React Testing Library for component testing
- Designed for low-bandwidth optimization
- Multi-language support infrastructure
