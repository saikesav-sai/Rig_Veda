FROM node:18-alpine

# Set work directory
WORKDIR /app

# Accept build argument for API base URL
ARG REACT_APP_API_BASE
ENV REACT_APP_API_BASE=$REACT_APP_API_BASE

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app (will use REACT_APP_API_BASE from ENV)
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 8009

# Create serve configuration to allow CORS
RUN echo '{"headers": [{"source": "**", "headers": [{"key": "Access-Control-Allow-Origin", "value": "*"}, {"key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS"}, {"key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization"}]}]}' > /app/serve.json

# Start React app (tunnel handled separately)
CMD ["serve", "-s", "build", "-l", "8009", "--cors", "--no-request-logging"]