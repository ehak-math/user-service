# Use official Node LTS
FROM node:18

WORKDIR /usr/src/app

# copy package files first to leverage docker cache
COPY package*.json ./

# install deps
RUN npm ci --only=production

# copy source
COPY . .

EXPOSE 4001

CMD ["node", "src/app.js"]
