# Event Notification System

A full-stack notification system for event management built with React Native, Node.js, Express, and MongoDB, containerized with Docker.

## Prerequisites

- Docker (v20.10.0 or later)
- Docker Compose (v2.0.0 or later)
- Node.js (v14 or later) - Only needed for development outside Docker
- npm or yarn - Only needed for development outside Docker
- Expo Go app (for testing on mobile devices)

## Project Structure

```
event-notification-system/
├── backend/               # Node.js/Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server
└── frontend/              # React Native frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # React context providers
    │   ├── screens/       # App screens
    │   ├── services/      # API services
    │   └── App.tsx        # Main app component
    ├── package.json       # Frontend dependencies
    └── app.json           # Expo configuration
```

## Development with Docker (Recommended)

### Prerequisites
- Ensure Docker and Docker Compose are installed on your system
- Make sure ports 80, 5000, and 19000-19006 are available

### Quick Start

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd event-notification-system
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://mongodb:27017/event-notification
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. Build and start all services:
   ```bash
   docker-compose up --build
   ```
   This will start:
   - MongoDB on port 27017
   - Backend API on port 5000
   - Frontend on port 19000 (Expo)
   - Nginx reverse proxy on port 80

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - MongoDB: mongodb://localhost:27017/event-notification

### Development Workflow

1. **Start services** (if not already running):
   ```bash
   docker-compose up -d
   ```

2. **View logs** for a specific service:
   ```bash
   docker-compose logs -f backend  # or frontend, mongodb, nginx
   ```

3. **Stop services**:
   ```bash
   docker-compose down
   ```

4. **Rebuild a specific service** after making changes:
   ```bash
   docker-compose up -d --build <service_name>
   ```

## Development without Docker

### Backend Setup

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file with the required variables (see above)

3. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Use the Expo Go app on your mobile device to scan the QR code, or use an emulator.

## Features

- User authentication (login/register)
- Real-time notifications
- Mark notifications as read
- Delete notifications
- Notification history
- Push notifications support

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification
- `POST /api/notifications/register-device` - Register device for push notifications

## Environment Variables

### Backend
- `PORT` - Port to run the server on (default: 5000)
- `MONGODB_URI` - MongoDB connection string (use `mongodb://mongodb:27017/event-notification` for Docker)
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Node environment (development/production)

### Frontend
- `REACT_APP_API_URL` - Backend API URL (automatically set in Docker)

## Docker Configuration

### Services
- **backend**: Node.js/Express API server
- **frontend**: React Native/Expo application
- **mongodb**: MongoDB database
- **nginx**: Reverse proxy for routing

### Volumes
- `mongodb_data`: Persistent storage for MongoDB data

### Networks
- `app-network`: Internal Docker network for service communication

## Testing

To test the application:

1. Start both the backend and frontend servers
2. Register a new user
3. Log in with your credentials
4. Test notification functionality

## Troubleshooting

- If you encounter any issues with the MongoDB connection, ensure MongoDB is running
- For Expo issues, try clearing the cache: `npx expo start -c`
- Make sure your mobile device and computer are on the same network when testing on a physical device

## License

This project is open source and available under the MIT License.
