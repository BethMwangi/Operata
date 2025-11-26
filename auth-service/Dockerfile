FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN npm run build

# Environment
ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002

CMD ["node", "dist/main.js"]
