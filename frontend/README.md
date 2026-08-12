# Task Tracker - Frontend Client

This is the frontend application for the Task Tracker project, built to demonstrate full-stack capabilities, modern UI patterns, and real-time collaboration.

## Tech Stack

- **Core:** React 18, TypeScript, Vite
- **State Management:** Redux Toolkit (global state), React `useState`/`useReducer` (local state)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **Network & Real-time:** Axios, Socket.io-client
- **Tooling:** ESLint, Prettier

## Features

- **Authentication:** JWT-based login/registration with automatic token refresh via Axios interceptors.
- **Workspaces & Projects:** Role-based access control (Owner/Member visibility).
- **Kanban Board:** Interactive drag-and-drop task management.
- **Real-time Updates:** WebSocket integration (Socket.io) ensures all team members see task updates instantly.
- **Optimistic UI:** Instant visual feedback during drag-and-drop operations, with automatic rollback if the API request fails.
- **Error Handling:** Centralized API error parsing and React Error Boundaries to prevent app crashes.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Environment Variables
Create a `.env` file in the root of the `frontend` directory based on the example:
```bash
cp .env.example .env
```

**.env.example**
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### 2. Running Locally (Development)
```bash
npm install
npm run dev
```

### 3. Running with Docker (Production Mode)
To run the entire application (Frontend, Backend, and Database), run this command from the **root** of the project:
```bash
docker-compose up --build -d
```
The frontend will be available at `http://localhost:5173` (or the port specified in your compose file).

## Architectural Decisions

1. **Vite over Create React App/Next.js:** Vite was chosen for its blazingly fast HMR and build times. Next.js was omitted because server-side rendering (SSR) is not strictly necessary for a dashboard-style, highly interactive authenticated app.
2. **State Management Split:** Redux Toolkit is used strictly for global/app-level state (e.g., Auth Session, User Profile). Component-specific data (like modal visibility, form inputs, or local task fetching) is managed via local React state. This prevents the Redux store from becoming a monolith.
3. **Axios Interceptors:** Implemented a centralized API client that intercepts 401 errors and automatically attempts to refresh the access token in the background before retrying the failed request.
4. **Optimistic Updates:** When a user moves a task on the Kanban board, the UI updates immediately before the API responds. This provides a snappy, native-like UX. If the server returns an error, the state reverts seamlessly.

## Compromises & Future Improvements

- **Advanced Pagination:** Currently, tasks are fetched using a simple `take/skip` offset. For a production app with thousands of tasks, I would implement cursor-based pagination combined with an Infinite Scroll (Intersection Observer) or virtualization.
- **Testing Coverage:** While the backend is tested, adding `Jest` and `React Testing Library` for critical UI components (especially the Drag & Drop logic and Redux reducers) would improve reliability.
- **Accessibility (a11y):** Keyboard navigation within the Kanban board and full ARIA attributes for modals need refinement to meet WCAG standards.
- **Caching & Query Management:** Migrating from standard `useEffect` fetching to **React Query (TanStack Query)** or **RTK Query** to handle caching, deduplication, and background refetching out of the box.