# Assignment Project — User Authentication & Task Management API

A backend REST API built with **Spring Boot** that provides secure user authentication and task management functionality. The application uses **JWT-based authentication** for securing endpoints and follows a clean, layered architecture (Controller → Service → Repository → Entity).

## Features

- User Registration & Login
- JWT-based Authentication & Authorization
- Role-based Access Control
- CRUD operations for Task Management
- Global Exception Handling with custom error responses
- Pagination support for task listing
- OpenAPI (Swagger) documentation
- Unit & Integration testing setup

## Tech Stack

- **Java**
- **Spring Boot**
- **Spring Security (JWT)**
- **Spring Data JPA / Hibernate**
- **MySQL**
- **Maven**

## Project Structure

```
src/main/java/com/api/auth
├── config/          # Application, Security & OpenAPI configuration
├── dto/             # Request & Response DTOs
├── entity/          # JPA Entities (User, Role, Task)
├── exception/       # Custom exceptions & global exception handler
├── repository/      # Spring Data JPA repositories
├── security/        # JWT filter & service
└── service/         # Business logic (Auth & Task services)
```

## API Endpoints (Sample)

| Method | Endpoint              | Description           |
|--------|-----------------------|------------------------|
| POST   | `/api/auth/register`  | Register a new user   |
| POST   | `/api/auth/login`     | Login & get JWT token |
| GET    | `/api/tasks`          | Get all tasks (paginated) |
| POST   | `/api/tasks`          | Create a new task      |
| PUT    | `/api/tasks/{id}`     | Update a task          |
| DELETE | `/api/tasks/{id}`     | Delete a task           |

## Getting Started

### Prerequisites
- JDK 17+
- Maven
- MySQL

### Run Locally

```bash
# Clone the repository
git clone https://github.com/Gungun740/Assignment-Project.git

# Navigate to project directory
cd Assignment-Project/Assignment

# Configure database credentials in
# src/main/resources/application.properties

# Run the application
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

## Author

**Gungun Sharma**  
Java Full Stack Developer
