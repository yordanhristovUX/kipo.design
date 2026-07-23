# kipo.design — single-container image: Node serves the API + the built SPA.
# Data (kipo.db) and uploads live on a mounted volume at /data.

# ---- Stage 1: build the web (Vite -> dist) ---------------------------------
FROM node:22-bookworm-slim AS web
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: backend deps (compiles native better-sqlite3) ----------------
FROM node:22-bookworm-slim AS api-deps
WORKDIR /app/backend
# Build toolchain as a safety net; better-sqlite3 normally uses a prebuilt binary.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev

# ---- Stage 3: runtime ------------------------------------------------------
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/kipo.db
ENV UPLOAD_DIR=/data/uploads
WORKDIR /app

# Backend source + its production node_modules (includes better-sqlite3).
COPY backend ./backend
COPY --from=api-deps /app/backend/node_modules ./backend/node_modules
# Built static site (served by the backend in production).
COPY --from=web /app/dist ./dist

# The volume holds the SQLite file + uploaded images across deploys/restarts.
VOLUME ["/data"]
EXPOSE 3001

CMD ["node", "backend/src/server.js"]
