FROM docker.1ms.run/library/node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com \
 && npm ci --ignore-scripts

COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY drizzle.config.ts ./drizzle.config.ts
COPY drizzle.config.json ./drizzle.config.json

ENV DATABASE_PATH=/app/database.sqlite
ENV UPLOAD_DIR=/app/uploads

EXPOSE 3001

CMD ["sh", "-c", "npx drizzle-kit push && npx tsx src/db/seed.ts && npx tsx src/server.ts"]
