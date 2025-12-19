# Civic Eye - Quick Start Guide

## Project Structure

```
Micro-shiv/
├── BACKEND-MICROSERVICES/     # Spring Boot microservices
│   ├── eureka-server/
│   ├── api-gateway/
│   ├── user-service/
│   ├── complaint-service/
│   ├── media-service/
│   ├── notification-service/
│   ├── kubernetes/
│   ├── postman/
│   └── docker-compose.yml
│
└── FRONTEND-V1/                # React frontend
    ├── src/
    ├── public/
    ├── package.json
    └── README.md
```

## Quick Start

### 1. Start Backend Services

```bash
cd BACKEND-MICROSERVICES
docker-compose up -d
```

Wait 2-3 minutes for all services to register with Eureka.

**Verify:**
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080

### 2. Start Frontend

```bash
cd FRONTEND-V1
npm install  # First time only
npm run dev
```

**Access:** http://localhost:5173

## Usage

1. **Register** a new account
2. **Login** with your credentials
3. **Create Complaint** with title, description, location, and optional image
4. **View Complaints** to see all your submitted issues
5. **Check Notifications** for status updates

## Features

✅ User authentication (Login/Register)
✅ Complaint management (Create/View)
✅ Image upload for complaints
✅ Real-time notifications
✅ Responsive design
✅ Modern UI with TailwindCSS

## Tech Stack

**Backend:**
- Spring Boot 3.2.0
- MySQL 8.0
- Eureka Server
- API Gateway

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS

## API Endpoints

All requests go through API Gateway at `http://localhost:8080/api`

- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /complaints` - Create complaint
- `GET /complaints/user/{userId}` - Get user complaints
- `POST /media/upload` - Upload image
- `GET /notifications/user/{userId}` - Get notifications

## Troubleshooting

**Backend not accessible:**
```bash
cd BACKEND-MICROSERVICES
docker-compose ps  # Check all containers are running
```

**Frontend build errors:**
```bash
cd FRONTEND-V1
rm -rf node_modules package-lock.json
npm install
```

## Documentation

- Backend: `BACKEND-MICROSERVICES/README.md`
- Frontend: `FRONTEND-V1/README.md`
- Postman Collection: `BACKEND-MICROSERVICES/postman/CivicEye-Collection.json`

## License

MIT
