# Backend Boilerplate - Enterprise-Grade TypeScript API

A production-ready backend boilerplate built with **TypeScript**, **Express.js**, and **Prisma ORM**. This project provides a robust foundation for building scalable, maintainable APIs with modern development practices.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 10.x (or npm/yarn)
- **PostgreSQL** database
- **Git**

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd boiler\ plate

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma Client
pnpm generate

# Run database migrations
pnpm migrate

# Start the development server
pnpm dev
```

---

## 📋 Tech Stack

### Core Framework
- **Express.js** (5.2.1) - Lightweight, flexible web framework
- **TypeScript** (6.0.2) - Type-safe JavaScript for larger codebases
- **Node.js** - JavaScript runtime

### Database & ORM
- **Prisma** (7.6.0) - Modern database ORM with type safety
- **PostgreSQL** - Robust relational database
- **@prisma/adapter-pg** - PostgreSQL adapter for Prisma

### Authentication
- **Better-Auth** (1.5.6) - Modern authentication library with built-in features:
  - Email/Password authentication
  - OAuth (Google)
  - Email verification with OTP
  - Password reset flow
  - Session management

### File Management
- **Cloudinary** (2.9.0) - Cloud-based image and file storage
- **Multer** (2.1.1) - File upload middleware
- **multer-storage-cloudinary** - Multer storage adapter for Cloudinary

### Payment Processing
- **Stripe** (22.0.0) - Payment gateway integration

### Email Service
- **Nodemailer** (8.0.4) - Email sending with SMTP support
- **EJS** (5.0.1) - Email template engine

### Utilities
- **Zod** (4.3.6) - TypeScript-first schema validation
- **JWT** (jsonwebtoken) - JSON Web Token authentication
- **Cookie-Parser** - HTTP cookie parsing
- **CORS** - Cross-Origin Resource Sharing
- **Date-FNS** (4.1.0) - Date manipulation library
- **node-cron** (4.2.1) - Task scheduling
- **PDFKit** (0.18.0) - PDF generation
- **UUID** (13.0.0) - UUID generation

### Development Tools
- **TSUp** (8.5.1) - Fast TypeScript bundler
- **TSX** (4.21.0) - TypeScript executor
- **ESLint** - Code quality and style checking
- **Prisma CLI** - Database management tools

---

## 🏗️ Project Structure

```
boilerplate/
├── src/
│   ├── app/
│   │   ├── config/               # Configuration files
│   │   │   ├── env.ts           # Environment variables validation
│   │   │   ├── cloudinary.config.ts
│   │   │   ├── multer.config.ts
│   │   │   └── stripe.config.ts
│   │   ├── errorHelpers/         # Error handling utilities
│   │   │   ├── AppError.ts       # Custom error class
│   │   │   ├── handleZodError.ts
│   │   │   └── handlePrismaErrors.ts
│   │   ├── interfaces/           # TypeScript interfaces
│   │   │   ├── error.interface.ts
│   │   │   ├── query.interface.ts
│   │   │   └── requestUser.interface.ts
│   │   ├── lib/
│   │   │   ├── auth.ts           # Better-Auth configuration
│   │   │   └── prisma.ts         # Prisma client instance
│   │   ├── middleware/           # Express middleware
│   │   │   ├── checkAuth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── validateRequest.ts
│   │   │   └── notFound.ts
│   │   ├── modules/              # Feature modules
│   │   │   ├── auth/             # Authentication module
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── auth.interface.ts
│   │   │   │   ├── auth.validation.ts
│   │   │   │   └── user.constant.ts
│   │   │   └── user/             # User module
│   │   ├── routes/               # API routes
│   │   │   └── index.ts
│   │   ├── shared/               # Shared utilities
│   │   │   ├── catchAsync.ts     # Async error wrapper
│   │   │   └── sendResponse.ts   # Standard response formatter
│   │   ├── templates/            # Email templates (EJS)
│   │   │   ├── otp.ejs
│   │   │   └── googleRedirect.ejs
│   │   └── utils/                # Utility functions
│   │       ├── cookie.ts
│   │       ├── email.ts
│   │       ├── jwt.ts
│   │       ├── token.ts
│   │       ├── queryBuilder.ts
│   │       └── seed.ts
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
├── prisma/
│   ├── schema/                   # Database schemas
│   │   ├── schema.prisma
│   │   ├── auth.prisma
│   │   ├── enums.prisma
│   │   └── profile.prisma
│   └── migrations/               # Database migrations
├── generated/
│   └── prisma/                   # Generated Prisma types
├── .env.example                  # Environment variables template
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
├── tsup.config.ts                # TSUp bundler configuration
├── prisma.config.ts              # Prisma configuration
├── vercel.json                   # Vercel deployment configuration
└── package.json                  # Project dependencies
```

---

## 🔐 Authentication Features

### Email/Password Authentication
```typescript
// Register user
POST /api/auth/sign-up/email
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

// Login user
POST /api/auth/sign-in/email
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

// Change password
POST /api/auth/change-password
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}

// Verify email with OTP
POST /api/auth/verify-email
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### OAuth (Google)
```typescript
// Initiate Google login
GET /api/auth/sign-in/google

// Google will redirect to callback URL after authentication
```

### Password Recovery
```typescript
// Request password reset
POST /api/auth/forgot-password
{
  "email": "john@example.com"
}

// Reset password with OTP
POST /api/auth/reset-password
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123"
}
```

---

## 📦 Database Schema

### User Model
```prisma
model User {
  id                 String
  name               String
  email              String (unique)
  emailVerified      Boolean (default: false)
  role               Role (default: USER)
  status             UserStatus (default: ACTIVE)
  needPasswordChange Boolean (default: false)
  isDeleted          Boolean (default: false)
  deletedAt          DateTime?
  fcmToken           String?
  createdAt          DateTime (default: now())
  updatedAt          DateTime (auto-updated)
  sessions           Session[]
  accounts           Account[]
  profile            profile[]
}
```

### Profile Model
```prisma
model profile {
  id        String (unique to user)
  firstName String
  lastName  String
  phone     String?
  image     String?
  bio       String?
  address   String
  city      String
  country   String
  userId    String (unique foreign key)
  user      User
  createdAt DateTime
  updatedAt DateTime
}
```

### Session Model
```prisma
model Session {
  id        String (unique)
  expiresAt DateTime
  token     String (unique)
  ipAddress String?
  userAgent String?
  userId    String (indexed)
  user      User
}
```

### Account Model
```prisma
model Account {
  id                    String (unique)
  accountId             String
  providerId            String
  userId                String (indexed)
  user                  User
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
}
```

---

## 🛠️ API Response Format

### Success Response
```typescript
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // response data
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

### Error Response
```typescript
{
  "success": false,
  "message": "Error message",
  "errorSources": [
    {
      "path": "field_name",
      "message": "Validation error message"
    }
  ],
  "stack": "..." // Only in development
}
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/boilerplate

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:8000
ACCESS_TOKEN_SECRET=access-token-secret
REFRESH_TOKEN_SECRET=refresh-token-secret
ACCESS_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# Session
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=30d
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=1d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@example.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/callback/google

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecureAdminPassword123

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 📚 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Production
pnpm build            # Build TypeScript to JavaScript
pnpm start            # Start production server

# Database
pnpm migrate          # Run Prisma migrations
pnpm push             # Push schema changes to database
pnpm pull             # Pull database schema
pnpm studio           # Open Prisma Studio UI

# Code Quality
pnpm lint             # Run ESLint

# Utilities
pnpm generate         # Generate Prisma Client
pnpm module <name>    # Generate new module boilerplate
pnpm stripe:webhook   # Listen to Stripe webhooks locally
```

---

## 🎯 Module Generation

The project includes a module generator to quickly scaffold new API modules:

```bash
pnpm module user
```

This creates a complete module structure with:
- Controller
- Service
- Route
- Interface
- Validation schema
- Constants

---

## 🔒 Error Handling

The boilerplate includes comprehensive error handling:

### Custom Error Class
```typescript
throw new AppError(status.BAD_REQUEST, "Error message");
```

### Error Types Handled
- **Zod Validation Errors** - Input validation failures
- **Prisma Errors** - Database operation failures
  - Known Request Errors (P2xxx codes)
  - Validation Errors
  - Connection Errors
  - Constraint Violations
- **JWT Errors** - Token validation failures
- **Malformed JSON** - Invalid request body
- **Generic Errors** - Fallback error handling

---

## ⚙️ Build Configuration

### TSUp Configuration
The project uses **TSUp** for fast TypeScript bundling with the following configuration:

```typescript
// tsup.config.ts
- Entry point: src/server.ts
- Output format: ESM (ES Modules)
- Platform: Node.js
- Target: Node 20+
- Output directory: api/ (for Vercel)
- Output extension: .mjs (for ES modules)
- External packages: pg-native (not bundled)
- Auto-generates shims for CJS compatibility
- Cleans output directory on each build
```

**Key Features:**
- ✅ Fast compilation using esbuild
- ✅ ES Module output for modern Node.js
- ✅ Vercel-compatible output structure
- ✅ Automatic shim generation for CommonJS compatibility

---

## 🚀 Deployment

### Vercel Configuration
The project is pre-configured for **Vercel** deployment via `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/server.mjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/server.mjs"
    }
  ]
}
```

**Configuration Details:**
- **Build** - Compiles TypeScript to ESM format in `api/` directory
- **Routes** - All requests are routed to the compiled server
- **Runtime** - Uses Vercel's Node.js runtime

### Deploying to Vercel

#### Method 1: Git Integration (Recommended)
```bash
# 1. Push code to GitHub/GitLab/Bitbucket
git push origin main

# 2. Connect repository to Vercel dashboard
# https://vercel.com/new

# 3. Vercel automatically builds and deploys on push
```

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Production deployment
vercel --prod
```

#### Environment Variables on Vercel
1. Go to your Vercel project → Settings → Environment Variables
2. Add all variables from `.env`:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `ACCESS_TOKEN_SECRET`
   - `REFRESH_TOKEN_SECRET`
   - And all other required variables

#### Build and Deployment Process
```
1. Push code to Git repository
2. Vercel detects changes
3. Runs: pnpm install
4. Runs: pnpm build (executes tsup)
5. Deploys compiled code from api/ directory
6. Updates serverless function with new code
```

**Deployment URL:**
Your API will be available at: `https://your-project.vercel.app`

### Other Deployment Options

#### Docker Deployment
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 8000

CMD ["pnpm", "start"]
```

#### Traditional VPS/Server
```bash
# Build
pnpm build

# Run production server
pnpm start

# Or use PM2 for process management
pm2 start dist/server.js --name "api"
```

---

##  Development Best Practices

### Type Safety
- All modules use TypeScript with strict mode enabled
- Zod for runtime validation
- Prisma for database type safety

### Error Handling
- Global error handler middleware
- Async error wrapper (`catchAsync`)
- Custom error classes

### Code Organization
- Feature-based module structure
- Separation of concerns (Controller/Service/Route)
- Reusable middleware and utilities

### API Standards
- RESTful API design
- Consistent response format
- Comprehensive error responses
- Query parameter validation

### Security
- JWT-based authentication
- CORS configuration
- Environment variable validation
- Password hashing (Better-Auth handles this)
- Session token validation

---

## 📧 Email Integration

The boilerplate includes email support with:

- **SMTP Configuration** - Gmail or custom SMTP servers
- **Email Templates** - EJS templates for dynamic emails
- **OTP Emails** - Verification and password reset OTPs
- **Error Logging** - Failed email logs

### Sending Emails
```typescript
import { sendEmail } from "./app/utils/email";

await sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  template: "welcome", // EJS template name
  data: { name: "John" }
});
```

---

## 💳 Payment Integration

**Stripe** integration is included with:

- Webhook handling for payment events
- Payment processing
- Subscription management support
- Error handling for failed transactions

---

## 📱 Task Scheduling

**node-cron** is integrated for scheduled tasks:

```typescript
import cron from 'node-cron';

// Example: Cancel unpaid purchases every 25 minutes
cron.schedule("*/25 * * * *", async () => {
  // Your scheduled task
});
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

### Code Style
- Follow ESLint rules
- Use TypeScript strict mode
- Add proper type annotations
- Write meaningful commit messages

---

## 📄 License

ISC

---

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
pnpm push  # or pnpm migrate
```

### Prisma Generation Errors
```bash
pnpm generate  # Regenerate Prisma Client
```

### Email Not Sending
- Verify SMTP credentials in .env
- Check Gmail "Less secure app access" settings
- Verify SMTP_FROM matches sender email

### Authentication Issues
- Check BETTER_AUTH_SECRET is set
- Verify OAuth credentials (Google)
- Clear browser cookies and try again

---

## 📞 Support

For issues and questions:
1. Check the documentation
2. Review error messages in console
3. Check `.env` configuration
4. Review database migrations status

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Better-Auth Documentation](https://better-auth.com/)
- [Zod Documentation](https://zod.dev/)
- [Stripe Documentation](https://stripe.com/docs)

---

**Happy coding! 🚀**
