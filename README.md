# Event Notification System

A full-stack notification system for event management built with React Native, Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or cloud instance)
- React Native development environment (Expo CLI)
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

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/event-notification
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API base URL in `frontend/src/services/api.ts`:
   ```typescript
   baseURL: 'http://YOUR_LOCAL_IP:5000/api', // Replace with your computer's local IP
   ```

4. Start the Expo development server:
   ```bash
   npx expo start
   ```

5. Use the Expo Go app on your mobile device to scan the QR code, or use an emulator.

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
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation

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
