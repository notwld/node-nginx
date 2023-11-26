FROM node:18

WORKDIR /app

COPY express/package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
