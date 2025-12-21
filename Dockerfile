FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code (but NOT .env thanks to .dockerignore)
COPY . .

# Expose port
EXPOSE 4001

# Start app
CMD ["node", "src/app.js"]