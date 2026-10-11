FROM node:20-alpine

WORKDIR /app

# Copy root manifest and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy server code
COPY server/ ./server/

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "server/server.js"]