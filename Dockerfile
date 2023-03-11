FROM node:18-alpine as builder

WORKDIR /app
COPY ./src ./src
COPY package.json LICENSE ./
RUN npm ci
RUN npm run build

FROM node:18-alpine

RUN addgroup -S user \
    && adduser -S user -G user

WORKDIR /app
COPY --from=builder /app/package.json /app/LICENSE ./
COPY --from=builder /app/lib  ./lib
RUN npm install

USER user

CMD ["node", "./lib/bin.js"]
