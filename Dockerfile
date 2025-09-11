# 1. Use Node.js base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# 2. Install dependencies only when needed
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Build the Next.js app
FROM base AS builder

# Accept build arguments for environment variables needed during build
ARG KEYCLOAK_ISSUER
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# Set environment variables for the build process
ENV KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER
ENV KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
ENV KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. Production image
FROM base AS runner
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 8080

# Cloud Run expects the server to listen on $PORT
ENV PORT=8080

# Start Next.js
CMD ["npm", "start"]
