# Innovator

A modern Next.js application built with cutting-edge technologies for building innovative solutions.

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.3 with Turbopack
- **React:** 19.1.0
- **Language:** TypeScript 5
- **Database:** Prisma ORM
- **Authentication:** Clerk
- **UI Components:** Radix UI + Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **API Layer:** tRPC
- **Background Jobs:** Inngest
- **Code Execution:** E2B Code Interpreter
- **Form Handling:** React Hook Form + Zod validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 20.x or higher
- npm or yarn or pnpm

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd innovator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory and add necessary environment variables for:
- Clerk authentication
- Prisma database connection
- Inngest
- E2B Code Interpreter
- Other required services

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
# or for migrations
npx prisma migrate dev
```

## 🚦 Available Scripts

- **`npm run dev`** - Starts the development server with Turbopack
- **`npm run build`** - Creates an optimized production build with Turbopack
- **`npm start`** - Starts the production server
- **`npm run lint`** - Runs ESLint to check code quality

## 🏃‍♂️ Getting Started

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## 📦 Key Dependencies

### UI & Components
- **Radix UI** - Unstyled, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icons
- **Recharts** - Composable charting library
- **Sonner** - Toast notifications

### Backend & API
- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Next-generation ORM
- **Inngest** - Background jobs and workflows
- **E2B Code Interpreter** - Secure code execution

### Authentication
- **Clerk** - Complete user management and authentication

### Form & Validation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

## 🏗️ Project Structure

```
innovator/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   ├── server/       # Server-side code (tRPC, Prisma)
│   └── styles/       # Global styles
├── prisma/           # Database schema
├── public/           # Static assets
└── package.json
```

## 🔒 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="your-database-url"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"

# Inngest
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# E2B
E2B_API_KEY="your-e2b-api-key"

# Add other required environment variables
```

## 🚀 Deployment

This project can be deployed on:

### Vercel (Recommended)
```bash
npm run build
```
Then deploy to Vercel via their CLI or GitHub integration.

### Other Platforms
Ensure your platform supports:
- Node.js 20+
- PostgreSQL (or your chosen database)
- Environment variables configuration

## 📝 License

This project is private and not available for public use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Development

Built with ❤️ using Next.js and modern web technologies.

---

**Note:** Make sure to configure all environment variables before running the application.
