# University Search Backend

## Overview
The University Search Backend is a monolith backend service designed to power a university search website. It allows users to search for universities based on various criteria like CGPA, program type, GRE score, IELTS score, and more for MS and BSc programs. The backend is built with a strong focus on maintainability, security, and performance, following well-established software design principles and patterns.

## Key Features
- **Monolith Architecture:** Simplifies deployment and development without the complexity of microservices.
- **Secure REST API:** Utilizes JWT for authentication and CSRF protection for added security.
- **Efficient Database Design:** PostgreSQL with TypeORM, fully normalized, ensuring optimal query performance.
- **Redis Caching:** Implements Redis to cache frequently accessed data, improving response times and reducing database load.
- **Reusable Services:** Promotes code reusability and cleaner architecture by using well-defined service components.
- **Design Patterns:** Implements Singleton, Factory, and Repository patterns.
- **SOLID Principles:** Adheres to Single Responsibility Principle (SRP), Open/Closed Principle (OCP), and Don't Repeat Yourself (DRY) principle.
- **API Documentation:** Swagger is integrated for easy access to API documentation.

## Tech Stack
- **Backend:** [NestJS](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [TypeORM](https://typeorm.io/)
- **Cache:** [Redis](https://redis.io/)
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** CSRF protection
- **CI/CD:** Docker and GitHub Actions for faster continuous integration and deployment.
- **API Documentation:** [Swagger](https://swagger.io/) for interactive API docs.

## Project Structure
```
common/                   # Database config and common resuable methods and services
|-- database
|-- dtos
|-- entities
|-- exceptions
|-- guards
|-- interceptors          
|-- middlewares           # Authentication and logging middleware
|-- pipes
|-- redis
|-- enum
|-- redis
...etc
src/
|-- controllers/          # Route handlers
|-- services/             # Reusable business logic
|-- repositories/         # Database access with TypeORM
|-- factories/            # Factory pattern implementation          
|-- config/               # Environment and application configuration
```

## Setup Instructions

### Prerequisites
- Node.js (14+)
- Yarn or npm
- PostgreSQL

### Installation
```bash
git clone https://github.com/kazi-akib-javed/co-backend.git
cd co-backend
yarn install
```

### Environment Variables
Create a `env/.env.dev` file and add the following:
```
Replce with your env's
```

### Database Synchronization 
Since migrations are not used, TypeORM's synchronization feature will automatically synchronize the database schema with the current entities. Ensure the database is correctly set up before starting the application.

### Start the Application
```bash
yarn start:dev
```

The server will run on `http://localhost:{env-port}`.

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - **Description**: Register a new user
  - **Request Body**: 
    ```json
    {
      "email": "user@example.com",
      "password": "your_password"
    }
    ```
  - **Response**:
    - 201 Created: Registration successful
    - 400 Bad Request: Invalid data
  - **Status Codes**: 201, 400

- **POST /api/auth/login**
  - **Description**: Authenticate and get a JWT token
  - **Request Body**: 
    ```json
    {
      "email": "user@example.com",
      "password": "your_password"
    }
    ```
  - **Response**:
    - 200 OK: Token successfully generated
    - 401 Unauthorized: Invalid credentials
  - **Status Codes**: 200, 401

- **POST /api/auth/logout**
  - **Description**: Log out the current user
  - **Response**:
    - 200 OK: Successfully logged out
  - **Status Codes**: 200

### Users

- **GET /api/users**
  - **Description**: Retrieve a list of users
  - **Response**:
    - 200 OK: List of users
  - **Status Codes**: 200

### Roles

- **GET /api/roles**
  - **Description**: Retrieve a list of roles
  - **Response**:
    - 200 OK: List of roles
  - **Status Codes**: 200

- **POST /api/roles**
  - **Description**: Create a new role
  - **Request Body**:
    ```json
    {
      "role_name": "admin"
    }
    ```
  - **Response**:
    - 201 Created: Role successfully created
  - **Status Codes**: 201

- **GET /api/roles/:id**
  - **Description**: Retrieve details of a specific role
  - **Response**:
    - 200 OK: Role details
  - **Status Codes**: 200

- **PUT /api/roles/:id**
  - **Description**: Update a specific role
  - **Request Body**:
    ```json
    {
      "role_name": "new_role_name"
    }
    ```
  - **Response**:
    - 200 OK: Role updated successfully
  - **Status Codes**: 200

- **DELETE /api/roles/:id**
  - **Description**: Delete a specific role
  - **Response**:
    - 204 No Content: Role deleted successfully
  - **Status Codes**: 204

### Permissions

- **POST /api/permissions**
  - **Description**: Create a new permission
  - **Request Body**:
    ```json
    {
      "permission_name": "can_edit"
    }
    ```
  - **Response**:
    - 201 Created: Permission successfully created
  - **Status Codes**: 201

- **GET /api/permissions**
  - **Description**: Retrieve a list of permissions
  - **Response**:
    - 200 OK: List of permissions
  - **Status Codes**: 200

- **GET /api/permissions/:id**
  - **Description**: Retrieve details of a specific permission
  - **Response**:
    - 200 OK: Permission details
  - **Status Codes**: 200

- **PUT /api/permissions/:id**
  - **Description**: Update a specific permission
  - **Request Body**:
    ```json
    {
      "permission_name": "new_permission_name"
    }
    ```
  - **Response**:
    - 200 OK: Permission updated successfully
  - **Status Codes**: 200

- **DELETE /api/permissions/:id**
  - **Description**: Delete a specific permission
  - **Response**:
    - 204 No Content: Permission deleted successfully
  - **Status Codes**: 204

### Role Permissions

- **GET /api/role-permissions**
  - **Description**: Retrieve a list of role permissions
  - **Response**:
    - 200 OK: List of role permissions
  - **Status Codes**: 200

### Scraper

- **GET /api/scraper**
  - **Description**: Scrape data (e.g., universities, programs)
  - **Response**:
    - 200 OK: Data successfully scraped
  - **Status Codes**: 200

### Programs

- **POST /api/programs**
  - **Description**: Create a new program
  - **Request Body**:
    ```json
    {
      "program_name": "Computer Science"
    }
    ```
  - **Response**:
    - 201 Created: Program successfully created
  - **Status Codes**: 201

- **GET /api/programs**
  - **Description**: Retrieve a list of programs
  - **Response**:
    - 200 OK: List of programs
  - **Status Codes**: 200

- **GET /api/programs/pagination**
  - **Description**: Paginate through programs
  - **Query Parameters**: `page`, `limit`
  - **Response**:
    - 200 OK: Paginated list of programs
  - **Status Codes**: 200

- **GET /api/programs/:id**
  - **Description**: Retrieve details of a specific program
  - **Response**:
    - 200 OK: Program details
  - **Status Codes**: 200

- **PUT /api/programs/:id**
  - **Description**: Update a specific program
  - **Request Body**:
    ```json
    {
      "program_name": "Updated Program Name"
    }
    ```
  - **Response**:
    - 200 OK: Program updated successfully
  - **Status Codes**: 200

- **DELETE /api/programs/:id**
  - **Description**: Delete a specific program
  - **Response**:
    - 204 No Content: Program deleted successfully
  - **Status Codes**: 204


## License
This project is licensed under the MIT License.

