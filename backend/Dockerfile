FROM node:24-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]
EXPOSE 4000