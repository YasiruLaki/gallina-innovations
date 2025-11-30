# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy the rest of the project
COPY . .

# Build the Next.js project
RUN npm run build

# Remove dev dependencies for a smaller final image
RUN npm prune --production

# Expose Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
