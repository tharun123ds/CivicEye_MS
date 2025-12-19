# Civic Eye Microservices Platform

A comprehensive microservices-based platform for citizens to report infrastructure issues like road damage, potholes, and other civic problems.

## Architecture

The system consists of 4 microservices:

- **User Service** (Port 8081) - User registration, authentication, and profile management
- **Complaint Service** (Port 8082) - Complaint creation and management with location data
- **Media Service** (Port 8083) - Image upload and storage for complaints
- **Notification Service** (Port 8084) - User notifications for complaint status updates

### Infrastructure Components

- **Eureka Server** (Port 8761) - Service registry and discovery
- **API Gateway** (Port 8080) - Single entry point for all client requests
- **MySQL Databases** - Separate database for each microservice

### Inter-Service Communication

Services communicate using **RestTemplate** with Eureka-based service discovery:
- Complaint Service validates users via User Service
- Complaint Service creates notifications via Notification Service
- Media Service validates complaints via Complaint Service
- Notification Service validates users via User Service

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Cloud**: 2023.0.0
- **Database**: MySQL 8.0
- **Build Tool**: Maven
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose
- Kubernetes (optional, for K8s deployment)
- MySQL 8.0 (if running locally without Docker)

## Quick Start with Docker Compose

### 1. Clone the Repository

```bash
cd c:\VS Code\Micro-shiv
```

### 2. Build All Services

```bash
# Build each service
cd eureka-server && mvn clean package -DskipTests && cd ..
cd api-gateway && mvn clean package -DskipTests && cd ..
cd user-service && mvn clean package -DskipTests && cd ..
cd complaint-service && mvn clean package -DskipTests && cd ..
cd media-service && mvn clean package -DskipTests && cd ..
cd notification-service && mvn clean package -DskipTests && cd ..
```

### 3. Start All Services

```bash
docker-compose up -d
```

### 4. Verify Services

- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080
- User Service: http://localhost:8081
- Complaint Service: http://localhost:8082
- Media Service: http://localhost:8083
- Notification Service: http://localhost:8084

Wait 2-3 minutes for all services to register with Eureka.

## Running Locally (Without Docker)

### 1. Start MySQL Databases

Create 4 MySQL databases:
```sql
CREATE DATABASE civiceye_user_db;
CREATE DATABASE civiceye_complaint_db;
CREATE DATABASE civiceye_media_db;
CREATE DATABASE civiceye_notification_db;
```

### 2. Start Services in Order

```bash
# 1. Start Eureka Server
cd eureka-server
mvn spring-boot:run

# 2. Start API Gateway (in new terminal)
cd api-gateway
mvn spring-boot:run

# 3. Start User Service (in new terminal)
cd user-service
mvn spring-boot:run

# 4. Start Complaint Service (in new terminal)
cd complaint-service
mvn spring-boot:run

# 5. Start Media Service (in new terminal)
cd media-service
mvn spring-boot:run

# 6. Start Notification Service (in new terminal)
cd notification-service
mvn spring-boot:run
```

## Kubernetes Deployment

### 1. Apply Kubernetes Manifests

```bash
# Create namespace and configurations
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/configmap.yaml

# Deploy MySQL
kubectl apply -f kubernetes/mysql-statefulset.yaml
kubectl apply -f kubernetes/pvc.yaml

# Deploy services
kubectl apply -f eureka-server/kubernetes/
kubectl apply -f api-gateway/kubernetes/
kubectl apply -f user-service/kubernetes/
kubectl apply -f complaint-service/kubernetes/
kubectl apply -f media-service/kubernetes/
kubectl apply -f notification-service/kubernetes/
```

### 2. Verify Deployment

```bash
kubectl get pods -n civiceye
kubectl get svc -n civiceye
```

### 3. Access API Gateway

```bash
kubectl get svc api-gateway -n civiceye
# Use the EXTERNAL-IP to access the API
```

## API Testing with Postman

### 1. Import Postman Collection

- Open Postman
- Import `postman/CivicEye-Collection.json`
- Collection includes all endpoints for all services

### 2. Test Workflow

#### Step 1: Register a User
```
POST /api/users/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "role": "USER"
}
```
Save the returned `id` as `userId`.

#### Step 2: Login
```
POST /api/users/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Step 3: Create a Complaint
```
POST /api/complaints
{
  "userId": 1,
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "POTHOLE",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address": "Main Street, Bangalore"
}
```
Save the returned `id` as `complaintId`.

#### Step 4: Upload Image
```
POST /api/media/upload
Form-data:
- file: [select image file]
- complaintId: 1
```

#### Step 5: Update Complaint Status
```
PUT /api/complaints/1/status
{
  "status": "IN_PROGRESS"
}
```
This automatically creates a notification.

#### Step 6: Get Notifications
```
GET /api/notifications/user/1
```

## API Endpoints

### User Service (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - Authenticate user
- `GET /{id}` - Get user by ID
- `GET /` - Get all users
- `PUT /{id}` - Update user
- `DELETE /{id}` - Delete user

### Complaint Service (`/api/complaints`)
- `POST /` - Create complaint
- `GET /{id}` - Get complaint by ID
- `GET /` - Get all complaints
- `GET /user/{userId}` - Get user's complaints
- `GET /?status={status}` - Filter by status
- `PUT /{id}` - Update complaint
- `PUT /{id}/status` - Update status
- `DELETE /{id}` - Delete complaint

### Media Service (`/api/media`)
- `POST /upload` - Upload image
- `GET /{id}` - Get media metadata
- `GET /{id}/download` - Download image
- `GET /complaint/{complaintId}` - Get complaint media
- `DELETE /{id}` - Delete media

### Notification Service (`/api/notifications`)
- `POST /` - Create notification
- `GET /user/{userId}` - Get user notifications
- `GET /user/{userId}?unreadOnly=true` - Get unread
- `PUT /{id}/read` - Mark as read
- `DELETE /{id}` - Delete notification

## Project Structure

```
Micro-shiv/
├── eureka-server/          # Service Registry
├── api-gateway/            # API Gateway
├── user-service/           # User Management
├── complaint-service/      # Complaint Management
├── media-service/          # Media Upload/Storage
├── notification-service/   # Notifications
├── kubernetes/             # K8s manifests
├── postman/                # Postman collection
└── docker-compose.yml      # Docker Compose config
```

## Troubleshooting

### Services not registering with Eureka
- Wait 30-60 seconds after starting Eureka
- Check Eureka dashboard at http://localhost:8761
- Verify `eureka.client.serviceUrl.defaultZone` in application.yml

### Database connection errors
- Ensure MySQL is running
- Verify database credentials in application.yml
- Check database exists

### File upload issues
- Ensure `uploads` directory exists
- Check file size limits in Media Service config
- Verify file permissions

## License

MIT License
