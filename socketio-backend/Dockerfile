FROM node:20.9-alpine as build

WORKDIR /app/build

COPY . .

RUN npm install
RUN npx tsc

FROM node:20.9-alpine as production

WORKDIR /app

COPY --from=build /app/build/package.json .
COPY --from=build /app/build/package-lock.json .
COPY --from=build /app/build/dist .

RUN npm ci --only=production

#EXPOSE 3005

#ENV NODE_ENV=production
#ENV SERVER_PORT=3005

USER node

CMD ["node", "server.js"]





