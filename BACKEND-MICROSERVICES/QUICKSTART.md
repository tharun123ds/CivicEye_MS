# Quick Start Guide - Civic Eye Microservices

## Option 1: Using Docker Compose (Recommended - Easiest)

This will start all services including MySQL databases automatically.

### Step 1: Stop Currently Running Services
Press `Ctrl+C` in all terminal windows running Maven.

### Step 2: Start Everything with Docker Compose
```bash
cd c:\VS Code\Micro-shiv
docker-compose up -d
```

### Step 3: Wait for Services to Start
Wait 2-3 minutes for all services to register with Eureka.

### Step 4: Verify
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080

---

## Option 2: Running Locally (Manual Setup)

If you want to run services individually with Maven, you need MySQL running first.

### Step 1: Install and Start MySQL

**Option A: Using Docker for MySQL only**
```bash
# Start MySQL databases
docker run -d --name mysql-user-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=civiceye_user_db -p 3306:3306 mysql:8.0
docker run -d --name mysql-complaint-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=civiceye_complaint_db -p 3307:3306 mysql:8.0
docker run -d --name mysql-media-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=civiceye_media_db -p 3308:3306 mysql:8.0
docker run -d --name mysql-notification-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=civiceye_notification_db -p 3309:3306 mysql:8.0
```

**Option B: Using Local MySQL Installation**
1. Install MySQL 8.0 on your machine
2. Create databases:
```sql
CREATE DATABASE civiceye_user_db;
CREATE DATABASE civiceye_complaint_db;
CREATE DATABASE civiceye_media_db;
CREATE DATABASE civiceye_notification_db;
```
3. Update `application.yml` in each service if your MySQL credentials are different from `root/root`

### Step 2: Wait for MySQL to be Ready
Wait 30 seconds for MySQL to fully start.

### Step 3: Start Services in Order

**Terminal 1: Eureka Server**
```bash
cd c:\VS Code\Micro-shiv\eureka-server
mvn spring-boot:run
```
Wait until you see "Started EurekaServerApplication"

**Terminal 2: API Gateway**
```bash
cd c:\VS Code\Micro-shiv\api-gateway
mvn spring-boot:run
```

**Terminal 3: User Service**
```bash
cd c:\VS Code\Micro-shiv\user-service
mvn spring-boot:run
```

**Terminal 4: Complaint Service**
```bash
cd c:\VS Code\Micro-shiv\complaint-service
mvn spring-boot:run
```

**Terminal 5: Media Service**
```bash
cd c:\VS Code\Micro-shiv\media-service
mvn spring-boot:run
```

**Terminal 6: Notification Service**
```bash
cd c:\VS Code\Micro-shiv\notification-service
mvn spring-boot:run
```

### Step 4: Verify All Services are Running
Open http://localhost:8761 and check that all 4 services are registered.

---

## Testing with Postman

1. Import `postman/CivicEye-Collection.json` into Postman
2. Start with "Register User" request
3. Follow the workflow in the collection

---

## Troubleshooting

### "Communications link failure" Error
**Cause**: MySQL is not running or not accessible on the expected port.

**Solution**: 
- If using Docker Compose: Run `docker-compose up -d`
- If running locally: Start MySQL databases first (see Step 1 above)
- Check MySQL is running: `docker ps` (for Docker) or check MySQL service status

### Services Not Registering with Eureka
**Cause**: Eureka Server not started or services started too quickly.

**Solution**: 
- Start Eureka Server first
- Wait 30 seconds before starting other services
- Check Eureka dashboard at http://localhost:8761

### Port Already in Use
**Cause**: Another service is using the port.

**Solution**:
- Stop the conflicting service
- Or change the port in `application.yml`
