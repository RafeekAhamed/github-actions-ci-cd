# ==========================================
# Stage 1: Build React Application
# ==========================================
FROM node:24-alpine AS build

WORKDIR /app

COPY app/package*.json ./

RUN npm ci

COPY app/ .

RUN npm run lint \
    && npm run test:run \
    && npm run build


# ==========================================
# Stage 2: Non-Root Nginx Production Runtime
# ==========================================
FROM nginx:1-alpine-slim AS production

# Copy custom Nginx main configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Remove the default Nginx server configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy production React build
COPY --from=build /app/dist /usr/share/nginx/html

# Configure writable runtime directories
RUN mkdir -p /tmp/nginx/client_temp \
    /tmp/nginx/proxy_temp \
    /tmp/nginx/fastcgi_temp \
    /tmp/nginx/uwsgi_temp \
    /tmp/nginx/scgi_temp \
    && chown -R 101:101 /tmp/nginx \
    && chown -R 101:101 /var/cache/nginx \
    && chown -R 101:101 /var/log/nginx

# Run as non-root user
USER 101:101

# Expose unprivileged HTTP port
EXPOSE 8080

# Container health check
HEALTHCHECK --interval=30s --timeout=3s \
    --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
