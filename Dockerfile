# Use the official Node.js image as the base image
FROM node:16 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy .env file if it exists
COPY .env .env

# Build the React app
RUN npm run build

# Use the official Node.js image for the backend
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy built React app from the build stage
COPY --from=build /app/build /app/build

# Copy .env file if it exists
COPY .env .env

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "run", "server:prod"]
