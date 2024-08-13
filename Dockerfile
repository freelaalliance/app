FROM node:lts

WORKDIR /app
COPY . /app

CMD ["npm", "start"]