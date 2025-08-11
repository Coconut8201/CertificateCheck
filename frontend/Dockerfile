FROM node:22-alpine

WORKDIR /app/frontend

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm serve

RUN pnpm install

COPY . .

ARG REACT_APP_BACKEND_API
ENV REACT_APP_BACKEND_API=$REACT_APP_BACKEND_API

RUN pnpm build

EXPOSE 3000

CMD ["serve", "-s", "build"]