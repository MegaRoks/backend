FROM node:14.9.0 AS builder
WORKDIR /usr/src/app/
COPY ./package.json yarn.lock ./
RUN yarn install
COPY ./ ./
RUN yarn build

FROM node:14.9.0-alpine
WORKDIR /usr/src/app/
COPY --from=builder /usr/src/app ./
EXPOSE 3000
CMD ["yarn", "start:prod"]
