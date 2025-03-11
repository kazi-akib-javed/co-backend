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

### Database Migration
```bash
yarn typeorm migration:run
```

### Start the Application
```bash
yarn start:dev
```

The server will run on `http://localhost:{env-port}`.

## API Endpoints
- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Authenticate and get a JWT token
- **GET /api/programs/pagination** - Search for universities based on criteria

## License
This project is licensed under the MIT License.

