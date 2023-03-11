FROM node:18-alpine as builder

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package.json /app/LICENSE ./
COPY --from=builder /app/lib  ./lib
RUN npm install

CMD ["node", "./lib/bin.js"]
