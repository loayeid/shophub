# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build your Next.js app
RUN npm run build

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Start Next.js in production
CMD ["npx", "next", "start"]
