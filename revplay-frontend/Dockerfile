# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build the app for production
RUN npm run build:prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/dist/revplay-frontend/browser /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]