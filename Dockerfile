# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./

# Install pnpm
RUN npm install -g pnpm

RUN pnpm install
COPY . .


# Start the app
CMD ["pnpm", "start"]
