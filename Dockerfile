# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Create and set backend directory
WORKDIR /app/backend

# Copy package files from backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]