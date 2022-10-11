FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install

ENV TZ="America/Sao_Paulo"

COPY . .

EXPOSE 3333

CMD [ "npm", "run", "dev" ]