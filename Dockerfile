FROM node:alpine

RUN apk update && apk add --no-cache make git

WORKDIR /app

COPY package*.json /app/

# RUN cd /app && npm ci --only=production
RUN cd /app && npm ci

COPY .  /app

RUN cd /app && npm run build

EXPOSE 3000
CMD ["npm", "start"]
