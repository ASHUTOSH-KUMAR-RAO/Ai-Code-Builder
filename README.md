# AI Code Builder 🚀

An intelligent code generation platform that transforms natural language descriptions into fully functional applications, similar to Lovable. Built with cutting-edge technologies to provide a seamless AI-powered development experience.

## ✨ Features

- **AI-Powered Code Generation**: Convert natural language prompts into production-ready code
- **Real-time Code Execution**: Secure sandbox environment for testing generated code
- **Modern Tech Stack**: Built with Next.js 14, React 19, and TypeScript
- **Type-Safe APIs**: End-to-end type safety with tRPC and Prisma
- **Authentication**: Secure user management with Clerk
- **Background Processing**: Reliable job processing with Inngest
- **Responsive UI**: Beautiful, accessible components with Tailwind CSS and shadcn/ui

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality React components

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Tanstack Query** - Powerful data fetching and caching
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Robust relational database
- **Neon** - Serverless PostgreSQL platform

### AI & Processing
- **Inngest** - Background jobs and workflows
- **E2B** - Secure code execution sandbox
- **OpenAI/Anthropic** - AI model integration (specify your choice)

### Infrastructure
- **Clerk** - Authentication and user management
- **Docker** - Containerization
- **Vercel** - Deployment and hosting (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Docker
- PostgreSQL database (or Neon account)
- Clerk account
- E2B account
- Inngest account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-code-builder.git
   cd ai-code-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # E2B Sandbox
   E2B_API_KEY=e2b_...
   
   # Inngest
   INNGEST_EVENT_KEY=...
   INNGEST_SIGNING_KEY=...
   
   # AI Provider (OpenAI/Anthropic)
   OPENAI_API_KEY=sk-...
   # or
   ANTHROPIC_API_KEY=sk-ant-...
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
ai-code-builder/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...
│   ├── lib/                # Utility functions
│   ├── server/             # tRPC server & API routes
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript definitions
├── prisma/                 # Database schema
├── public/                 # Static assets
├── docker/                 # Docker configuration
└── docs/                   # Documentation
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Docker Production

```bash
# Build production image
docker build -t ai-code-builder .

# Run production container
docker run -p 3000:3000 ai-code-builder
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](ISC) file for details.

## 🙏 Acknowledgments

- [Lovable](https://lovable.dev) for inspiration
- [Next.js](https://nextjs.org) team for the amazing framework
- [tRPC](https://trpc.io) for type-safe APIs
- [Prisma](https://prisma.io) for the excellent ORM
- [shadcn](https://ui.shadcn.com) for beautiful components


---

**Built with ❤️ using AI and modern web technologies**
