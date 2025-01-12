# FROM node:22.12.0-alpine

# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# WORKDIR /home/node/app

# COPY package*.json ./

# RUN yarn install --cache-folder /tmp/.yarn-cache && rm -rf /tmp/.yarn-cache

# COPY --chown=node:node . .

# RUN yarn build

# USER node

# EXPOSE 4000

# CMD [ "yarn", "start:prod" ]

# Use official Node.js image as the base image
FROM node:22.12.0-alpine

# Set working directory inside the container
WORKDIR /home/node/app

# Copy package.json and yarn.lock first to leverage Docker's cache mechanism
COPY package*.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Build
RUN yarn build

# Copy only the build output (dist folder) and necessary files for production
COPY dist ./dist

# Use non-root user for better security
USER node

# Expose the application port
EXPOSE 8080

# Start the application in production mode
CMD ["yarn", "start:prod"]
