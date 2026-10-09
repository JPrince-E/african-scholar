FROM node:20-alpine

WORKDIR /app

# Install dependencies first for build layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

# Expose API port
EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "src/server.js"]
