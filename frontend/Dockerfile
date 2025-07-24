# Use Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Expo CLI globally
RUN npm install -g expo-cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose the port the app runs on
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19006

# Start the app
CMD ["npx", "expo", "start", "--web"]
