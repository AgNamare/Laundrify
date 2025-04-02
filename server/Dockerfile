# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /server

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that the app runs on
EXPOSE 5000

# Set environment variables (use real ones in production)
ENV PORT=5000

# Start the application
CMD ["npm", "start"]
