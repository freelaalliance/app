FROM node:20

WORKDIR /app
COPY . /app

CMD ["npm", "start"]