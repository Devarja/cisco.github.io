
#stage-1 : builder
FROM node:10-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

# Install Gulp CLI globally to ensure the 'gulp' command is available
RUN npm install -g gulp-cli

COPY . .

RUN gulp build

# Stage 2: runner stage
FROM nginx:stable-alpine

# Copy the built static assets from the 'builder' stage's 'dist' directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

Command to run Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]
