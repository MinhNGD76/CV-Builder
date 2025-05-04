# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install deps
COPY package*.json ./
RUN npm install

# 4. Copy all source code
COPY . .

# 5. Build the NestJS project
RUN npm run build

# 6. Run the compiled app
CMD ["node", "dist/main"]
