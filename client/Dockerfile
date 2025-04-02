# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR ./

# Copy package.json and package-lock.json to install dependencies
COPY client/package*.json ./

# Install dependencies for the client
RUN npm install

# Copy the rest of the client app files
COPY client/ ./

# Build the React app (or Vite app)
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built client files from the build stage into Nginx's default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the React app
EXPOSE 80

# Run Nginx to serve the built app
CMD ["nginx", "-g", "daemon off;"]
