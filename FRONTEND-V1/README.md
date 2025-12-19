# Civic Eye Frontend

Modern React frontend application for the Civic Eye microservices platform. Built with React, TypeScript, Vite, and TailwindCSS.

## Features

- 🔐 **User Authentication** - Login and registration with JWT
- 📝 **Complaint Management** - Create, view, and track civic infrastructure complaints
- 📸 **Image Upload** - Attach photos to complaints
- 🔔 **Notifications** - Real-time updates on complaint status
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful interface with TailwindCSS

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **Lucide React** - Icon library

## Prerequisites

- Node.js 18+ and npm
- Backend microservices running (see `../BACKEND-MICROSERVICES/README.md`)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx       # Login form component
│   │   └── RegisterForm.tsx    # Registration form component
│   ├── ui/                     # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── Dashboard.tsx           # Main dashboard component
├── pages/
│   └── AuthPage.tsx            # Authentication page
├── lib/
│   ├── api.ts                  # API client for backend
│   └── utils.ts                # Utility functions
├── App.tsx                     # Main app component
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## API Integration

The frontend connects to the Spring Boot backend via the API Gateway at `http://localhost:8080/api`.

### Endpoints Used

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/{id}` - Get user details
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/user/{userId}` - Get user's complaints
- `POST /api/media/upload` - Upload complaint image
- `GET /api/notifications/user/{userId}` - Get notifications

## Usage

### Register a New Account

1. Click "Sign up" on the auth page
2. Fill in username, email, phone number, and password
3. Click "Create Account"

### Login

1. Enter your email and password
2. Click "Login"

### Create a Complaint

1. Navigate to "Create Complaint" tab
2. Fill in the form:
   - Title: Brief description
   - Category: Select issue type
   - Description: Detailed explanation
   - Address: Location of the issue
   - Latitude & Longitude: GPS coordinates
   - Image: Optional photo upload
3. Click "Submit Complaint"

### View Your Complaints

1. Navigate to "My Complaints" tab
2. See all your submitted complaints with their status:
   - 🟡 PENDING - Awaiting review
   - 🔵 IN_PROGRESS - Being addressed
   - 🟢 RESOLVED - Issue fixed
   - ⚫ REJECTED - Not actionable

### Check Notifications

1. Navigate to "Notifications" tab
2. View updates on your complaints

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

The API base URL is configured in `src/lib/api.ts`. To change it:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Troubleshooting

### Backend Connection Issues

- Ensure backend services are running: `cd ../BACKEND-MICROSERVICES && docker-compose up -d`
- Verify API Gateway is accessible at `http://localhost:8080`
- Check Eureka dashboard at `http://localhost:8761` to confirm all services are registered

### CORS Errors

The Vite dev server is configured with a proxy to avoid CORS issues. If you encounter problems, check `vite.config.ts`.

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure you're using Node.js 18 or higher: `node --version`

## License

MIT License
