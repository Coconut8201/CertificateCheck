FROM node:22-alpine

WORKDIR /app/backend

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 9614

CMD ["npm", "start"]