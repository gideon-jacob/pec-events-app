# Event Notification System

A modern application with React Native frontend, Node.js/Express backend, MongoDB, and Nginx.

## Project Structure

- `/frontend` - React Native (Expo) mobile application
- `/backend` - Node.js/Express API server
- `/nginx` - Nginx reverse proxy configuration

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development without Docker)
- Expo Go app (for testing on mobile devices)

## Getting Started

### With Docker (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend (Expo): http://localhost:19006
   - Backend API: http://localhost:5000/api
   - MongoDB: mongodb://localhost:27017/eventdb

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Without Docker (Development)

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Use the Expo Go app on your mobile device to scan the QR code, or use an emulator.

## Development Workflow

- The backend will automatically restart when you make changes to the code.
- The frontend will hot-reload as you make changes.
- The MongoDB data will persist in a Docker volume named `event-notification-system_mongodb_data`.

## Notifications

This application uses Expo Notifications (EAS) for push notifications and native notification handling.

### Expo Notifications (EAS)

The app leverages Expo's notification service for cross-platform push notifications:

- **EAS Build**: Used for building native apps with notification capabilities
- **Push Tokens**: Each device registers for push notifications and receives a unique token
- **Server Integration**: Backend sends notifications via Expo's push notification service

#### Setup Requirements

1. **EAS CLI Installation**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **EAS Login**:
   ```bash
   eas login
   ```

3. **Configure EAS Build**:
   ```bash
   eas build:configure
   ```

#### Notification Configuration

The app includes:
- Push token registration and management
- Notification permission handling
- Background notification processing
- Custom notification sounds and badges

### Native Notifications

The application uses the `nativenotify` package for enhanced native notification capabilities:

- **Local Notifications**: Scheduled notifications for upcoming events
- **Background Processing**: Notifications triggered by app state changes
- **Custom Actions**: Interactive notifications with action buttons
- **Rich Notifications**: Support for images, sounds, and custom layouts

#### NativeNotify Package

The `nativenotify` package provides:
- Cross-platform notification APIs
- Advanced notification scheduling
- Custom notification sounds and vibrations
- Notification grouping and management
- Deep linking support for notification actions

#### Platform-Specific Features

- **iOS**: Rich notifications, notification actions, and background app refresh
- **Android**: Notification channels, priority levels, and custom notification styles

## Environment Variables

### Backend

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/eventdb
EXPO_ACCESS_TOKEN=your_expo_access_token
```

### Frontend

Create a `.env` file in the `frontend` directory with the following variables:

```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## Troubleshooting

- If you encounter port conflicts, check which services are running and stop them.
- Make sure Docker is running before starting the services.
- If you change environment variables, you'll need to rebuild the containers.

## License

This project is open source and available under the [MIT License](LICENSE).
