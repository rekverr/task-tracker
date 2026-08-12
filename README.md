## Tech Stack

### Frontend

- React
- TypeScript

### Backend

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- JWT

## Project Structure

project/
├── frontend/    # Next.js application
├── backend/     # NestJS API

## Requirements

- Node
- PostgreSQL
- Docker
- Docker Compose

## Installation

Clone the repository:

git clone <repository-url>
cd <project-directory>

Create a `.env` file in the root directory:

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173

Start the application:

docker compose up --build

The application will be available at:

Frontend: http://localhost:5173
Backend: http://localhost:3000
PostgreSQL: localhost:5433
