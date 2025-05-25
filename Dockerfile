# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Build your app (for Next.js)
RUN npm run build

# Set environment variable for production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
