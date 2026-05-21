# Issue Tracker - Full Stack Application

A modern, full-stack issue tracking application built with React, TypeScript, Express.js, and MongoDB. Features a beautiful UI, complete CRUD operations, authentication, filtering, pagination, and export functionality.

## 🚀 Features

### Core Functionality
- ✅ **User Authentication**: JWT-based secure authentication with registration and login
- ✅ **Issue Management**: Complete CRUD operations for issues
- ✅ **Real-time Statistics**: Dashboard with issue counts by status
- ✅ **Advanced Filtering**: Filter by status, priority, severity
- ✅ **Search**: Real-time search with debouncing
- ✅ **Pagination**: Efficient pagination for large datasets
- ✅ **Export**: Export issues to JSON or CSV format
- ✅ **Status Management**: Update issue status with confirmation
- ✅ **Visual Indicators**: Color-coded badges for status, priority, and severity

### Bonus Features
- ✅ **TypeScript**: Full type safety across frontend and backend
- ✅ **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- ✅ **State Management**: Zustand for efficient global state
- ✅ **Reusable Components**: Component-based architecture
- ✅ **SOLID Principles**: Clean architecture with separation of concerns
- ✅ **OOP Patterns**: Repository, Service, and Controller patterns
- ✅ **Code Quality**: Well-documented, maintainable code

## 🏗️ Architecture

### Backend Architecture (Layered/Clean Architecture)
```
backend/
├── src/
│   ├── controllers/      # Handle HTTP requests (thin layer)
│   ├── services/         # Business logic layer
│   ├── repositories/     # Data access layer (Database operations)
│   ├── models/           # Mongoose schemas and models
│   ├── middleware/       # Authentication, validation, error handling
│   ├── routes/           # API route definitions
│   ├── config/           # Database and environment configuration
│   ├── types/            # TypeScript interfaces and types
│   └── utils/            # Helper functions and validators
```

**Design Patterns Used:**
- **Repository Pattern**: Abstraction over database operations
- **Service Pattern**: Business logic separation
- **MVC Pattern**: Controllers handle requests, delegate to services
- **Singleton Pattern**: Database connection, API client
- **Factory Pattern**: Model creation

### Frontend Architecture (Component-Based)
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Helper functions
│   └── hooks/            # Custom React hooks (if needed)
```

**SOLID Principles Applied:**
- **Single Responsibility**: Each class/component has one responsibility
- **Open/Closed**: Components extensible through props, not modification
- **Liskov Substitution**: Components can be swapped with compatible ones
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
cd /Users/ransika/Documents/newnop
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created, review and update if needed)
# The .env file contains:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/issue-tracker
# - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
# - JWT_EXPIRES_IN=7d
# - CORS_ORIGIN=http://localhost:5173

# Start MongoDB (if not running)
# macOS:
brew services start mongodb-community
# or
mongod --config /usr/local/etc/mongod.conf

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file (already created)
# Contains: VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🎯 Usage

### 1. Register a New Account
- Navigate to `http://localhost:5173`
- Click "Sign up" to create a new account
- Fill in your name, email, and password
- You'll be automatically logged in after registration

### 2. Login
- If you already have an account, use the login page
- Enter your email and password
- You'll be redirected to the dashboard

### 3. Create an Issue
- Click the "New Issue" button
- Fill in the title, description, priority, and severity
- Click "Create Issue"

### 4. Manage Issues
- **View**: See all issues in the dashboard
- **Search**: Use the search bar to find specific issues
- **Filter**: Apply filters by status, priority, or severity
- **Edit**: Click the edit icon to update an issue
- **Delete**: Click the delete icon and confirm
- **Mark as Resolved**: Click the checkmark icon to resolve an issue

### 5. Export Issues
- Click the "Export" button
- Choose JSON or CSV format
- File will be downloaded automatically

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login with error handling
- [ ] Create new issue
- [ ] Edit existing issue
- [ ] Delete issue with confirmation
- [ ] Update issue status
- [ ] Search issues
- [ ] Filter by status/priority/severity
- [ ] Pagination navigation
- [ ] Export to JSON
- [ ] Export to CSV
- [ ] Logout functionality

## 📁 Project Structure Explained

### Backend

#### Models Layer
- Defines database schemas with Mongoose
- Includes validation rules and middleware
- `User.model.ts`: User schema with password hashing
- `Issue.model.ts`: Issue schema with auto-indexing

#### Repository Layer
- Abstracts database operations
- Provides reusable CRUD methods
- `BaseRepository.ts`: Generic repository for all models
- `UserRepository.ts`: User-specific operations
- `IssueRepository.ts`: Issue operations with pagination

#### Service Layer
- Contains business logic
- Validates data and enforces business rules
- `AuthService.ts`: Authentication logic, JWT generation
- `IssueService.ts`: Issue management logic

#### Controller Layer
- Handles HTTP requests/responses
- Thin layer that delegates to services
- `AuthController.ts`: Auth endpoints
- `IssueController.ts`: Issue CRUD endpoints

#### Middleware
- `auth.middleware.ts`: JWT verification
- `validation.middleware.ts`: Request validation
- `errorHandler.middleware.ts`: Global error handling

### Frontend

#### Components
- Reusable UI components following composition pattern
- `Button.tsx`, `Input.tsx`, `Select.tsx`: Form components
- `Card.tsx`, `Badge.tsx`, `Modal.tsx`: Layout components
- `Navbar.tsx`: Application navigation
- `IssueForm.tsx`: Complex form for create/edit

#### Pages
- `Login.tsx`: Authentication page
- `Register.tsx`: User registration page
- `Dashboard.tsx`: Main application page with all features

#### Store (Zustand)
- `authStore.ts`: Authentication state
- `issueStore.ts`: Issues state with actions

#### Services
- `api.ts`: Axios instance with interceptors
- `authService.ts`: Authentication API calls
- `issueService.ts`: Issue API calls

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication
- Protected API routes
- HTTP-only considerations
- Input validation on both frontend and backend
- SQL injection prevention (using MongoDB with Mongoose)
- XSS prevention through React's built-in escaping

## 🎨 UI/UX Features

- Modern, clean design with Tailwind CSS
- Responsive layout (mobile-friendly)
- Color-coded status indicators
- Smooth animations and transitions
- Loading states
- Error handling with toast notifications
- Confirmation dialogs for destructive actions
- Accessible components

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Issues
- `GET /api/issues` - Get all issues (with filters, pagination)
- `GET /api/issues/stats` - Get issue statistics
- `GET /api/issues/:id` - Get issue by ID
- `POST /api/issues` - Create new issue (protected)
- `PUT /api/issues/:id` - Update issue (protected)
- `DELETE /api/issues/:id` - Delete issue (protected)
- `PATCH /api/issues/:id/status` - Update issue status (protected)
- `GET /api/issues/export` - Export issues (protected)

## 🚀 Deployment

### Backend Deployment (e.g., Railway, Render, Heroku)
1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Update `MONGODB_URI` to production database
4. Update `CORS_ORIGIN` to frontend URL
5. Build: `npm run build`
6. Start: `npm start`

### Frontend Deployment (e.g., Vercel, Netlify)
1. Update `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy the `dist` folder

### Environment Variables for Production
Backend:
- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI=<your-production-mongodb-uri>`
- `JWT_SECRET=<strong-secret-key>`
- `JWT_EXPIRES_IN=7d`
- `CORS_ORIGIN=<your-frontend-url>`

Frontend:
- `VITE_API_URL=<your-backend-url>/api`

## 🧑‍💻 Code Quality

### Naming Conventions
- **PascalCase**: Classes, Components, Interfaces
- **camelCase**: Functions, variables, methods
- **UPPER_SNAKE_CASE**: Constants, Enums

### Comments and Documentation
- JSDoc comments for classes and public methods
- Inline comments for complex logic
- README for setup and usage

### Code Organization
- Logical separation of concerns
- DRY principle applied
- Consistent file structure
- Meaningful variable names

## 📝 Key Implementation Details

### How to Explain the Architecture

**Backend (3-Layer Architecture)**:
1. **Controller**: Receives HTTP request → validates → calls service
2. **Service**: Contains business logic → calls repository
3. **Repository**: Interacts with database → returns data

Example: Creating an issue
```
Client → Controller.createIssue()
       → Service.createIssue() (validates, adds createdBy)
       → Repository.create() (saves to DB)
       → Returns to client
```

**Frontend (Component-Based with State Management)**:
1. **Component**: UI presentation
2. **Store**: Global state with Zustand
3. **Service**: API communication
4. **Types**: Type safety with TypeScript

Example: User login
```
LoginPage → calls authStore.login()
         → calls AuthService.login() (API call)
         → Updates store with user data
         → Redirects to dashboard
```

## 🛠️ Technologies Used

### Backend
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation

### Frontend
- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Zustand**: State management
- **React Router**: Routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **React Hot Toast**: Notifications
- **date-fns**: Date formatting

## 📞 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Verify MongoDB is running
3. Ensure environment variables are set correctly
4. Check that both servers are running

## 📄 License

This project is created for assignment purposes.

---

**Built with ❤️ using modern web technologies and best practices**
