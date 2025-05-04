# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (cache layers)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code into the container
COPY . .

# Build the NestJS project
RUN npm run build 

# Expose container port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
