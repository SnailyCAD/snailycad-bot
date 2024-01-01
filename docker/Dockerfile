# Builder Image
FROM node:18 as builder

WORKDIR /srv

COPY . .

RUN yarn install && yarn run build

# Development Image
FROM node:18 as development 

COPY docker/entrypoint.sh .

RUN chmod +x entrypoint.sh

WORKDIR /srv

ENTRYPOINT ["/entrypoint.sh"]

# Production Image
FROM node:18-alpine as production

COPY docker/entrypoint.sh .

RUN chmod +x entrypoint.sh

WORKDIR /app

COPY --from=builder /srv/package.json /srv/yarn.lock /srv/.yarn /srv/prisma .
COPY --from=builder /srv/dist ./dist

RUN yarn install --production

ENTRYPOINT ["/entrypoint.sh"]
