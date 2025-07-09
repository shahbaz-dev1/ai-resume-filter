# AI HR Resume Filter

A comprehensive AI-powered HR system for automated CV analysis and candidate evaluation. Built with NestJS backend and Next.js frontend, featuring vector database integration and AI-powered analysis.

## 🚀 Features

### Core Functionality
- **CV Upload & Parsing**: Support for PDF and DOCX file formats
- **AI-Powered Analysis**: Automated CV-to-job matching using OpenAI and Gemini embeddings
- **Vector Database**: Semantic search and knowledge storage using LanceDB
- **User Authentication**: JWT-based authentication with role-based access control
- **Admin Dashboard**: User management and activity monitoring
- **Real-time Analysis**: Instant feedback on candidate-job fit

### Technical Features
- **Modular Architecture**: Clean separation of concerns with DRY and SOLID principles
- **Type Safety**: Full TypeScript implementation
- **Responsive UI**: Modern UI with Chakra UI components
- **File Processing**: Automatic parsing of CV content from various formats
- **Scalable Design**: Ready for production deployment

## 🛠 Tech Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **Vector DB**: LanceDB for semantic search
- **AI Integration**: OpenAI and Google Gemini APIs
- **Authentication**: JWT with Passport.js
- **File Processing**: Multer, pdf-parse, mammoth
- **Validation**: Built-in NestJS validation

### Frontend (Next.js)
- **Framework**: Next.js with TypeScript
- **UI Library**: Chakra UI v3
- **State Management**: React hooks
- **Authentication**: JWT token management
- **File Upload**: Native HTML5 file input
- **Responsive Design**: Mobile-first approach

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- OpenAI API key (optional)
- Google Gemini API key (optional)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-hr-resume-filter
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend Environment (.env)
```env
# Database
DATABASE_URL=./data/database.sqlite

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# AI Provider Keys
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key

# File Upload
UPLOAD_DIR=./uploads

# Embedding Provider (default)
EMBEDDING_PROVIDER=gemini

# Server Port
PORT=3001
```

#### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

### 4. Database Setup
```bash
# Backend will automatically create SQLite database on first run
cd backend
npm run start:dev
```

### 5. Start Development Servers

#### Backend
```bash
cd backend
npm run start:dev
# Server runs on http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/me` - Get current user profile
- `PUT /users/update` - Update user profile
- `POST /users/change-password` - Change password

### Vector Operations
- `POST /vector/add` - Add document to vector DB
- `POST /vector/search` - Search similar documents
- `POST /vector/analyze` - Analyze CV against job description

### Admin Operations (Admin only)
- `GET /users` - List all users
- `PUT /users/:id/promote` - Promote user to admin
- `PUT /users/:id/demote` - Demote admin to user
- `DELETE /users/:id` - Delete user
- `GET /users/activity` - View all activity logs

## 🎯 Usage Examples

### 1. User Registration
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. CV Analysis
```bash
curl -X POST http://localhost:3001/vector/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@resume.pdf" \
  -F "jobDescription=Software Engineer role..." \
  -F "model=gemini"
```

### 3. Vector Search
```bash
curl -X POST http://localhost:3001/vector/search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "search query",
    "topK": 5,
    "provider": "gemini"
  }'
```

## 🏗 Project Structure

```
ai-hr-resume-filter/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── vector/         # Vector DB operations
│   │   ├── app.module.ts   # Main module
│   │   └── main.ts         # Application entry
│   ├── data/               # SQLite database files
│   └── uploads/            # File upload directory
├── frontend/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Next.js pages
│   ├── lib/               # Utility functions
│   └── public/            # Static assets
└── README.md
```

## 🔧 Development

### Code Quality
- **DRY Principle**: Reusable components and utilities
- **SOLID Principles**: Clean architecture and separation of concerns
- **TypeScript**: Full type safety throughout the application
- **Comments**: Detailed documentation for maintainability

### Key Components

#### Backend
- **AuthService**: JWT token generation and validation
- **UserService**: User CRUD operations
- **VectorService**: LanceDB integration for semantic search
- **EmbeddingService**: AI provider integration (OpenAI/Gemini)

#### Frontend
- **withAuth HOC**: Route protection for authenticated users
- **AdminGuard**: Role-based access control
- **Navbar**: Navigation and user management
- **VectorPage**: CV upload and analysis interface

### Environment Variables
- **Global Configuration**: All configuration via environment variables
- **Security**: No hardcoded secrets or API keys
- **Flexibility**: Easy deployment across different environments

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

### Docker (Optional)
```dockerfile
# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and user role management
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request handling
- **File Upload Security**: File type and size validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the code comments
- Review the API endpoints documentation above

## 🔮 Future Enhancements

- **Advanced AI Analysis**: LLM-based detailed candidate assessment
- **Interview Scheduling**: Automated interview coordination
- **Performance Analytics**: Hiring success metrics
- **Multi-language Support**: International candidate support
- **Integration APIs**: HRIS and ATS integrations
- **Advanced Search**: Semantic search with filters
- **Bulk Operations**: Batch CV processing
- **Export Features**: Analysis report generation

---

**Built with ❤️ using NestJS, Next.js, and AI technologies** 