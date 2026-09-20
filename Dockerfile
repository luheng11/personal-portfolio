FROM docker.1ms.run/library/node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com \
 && npm ci

COPY index.html ./
COPY vite.config.ts tsconfig.json tailwind.config.js postcss.config.js ./
COPY src ./src
COPY public ./public

RUN npx vite build

FROM docker.1ms.run/library/nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
