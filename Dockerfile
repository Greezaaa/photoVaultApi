# Use an official Node.js runtime as a parent image
FROM node:16-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the NestJS app
EXPOSE 3000

# Run the NestJS app
CMD ["npm", "run", "start:prod"]
