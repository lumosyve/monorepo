FROM node:alpine as development

WORKDIR /usr/app

COPY package.json ./

# RUN npm install cnpm -g

# RUN cnpm install

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine as production

WORKDIR /usr/app

COPY package.json ./

# RUN npm install cnpm -g

# RUN cnpm install

RUN npm install

COPY . .

COPY --from=development /usr/app/dist ./dist

CMD ["npm","run","start:prod"]




