# Use the official Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Install necessary system packages
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pixman \
    cairo-dev \
    pango-dev \
    musl-dev \
    libc6-compat \
    jpeg-dev \
    giflib-dev \
    imagemagick \
    ttf-dejavu



# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables to be used in Railway
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
