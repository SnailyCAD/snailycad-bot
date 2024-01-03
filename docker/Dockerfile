# Builder Image
FROM node:18 as builder

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini

COPY docker/entrypoint.sh .

RUN chmod +x entrypoint.sh tini

WORKDIR /srv

COPY . .

RUN yarn install --silent && yarn run build

# Development Image
FROM node:18 as development 

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini

COPY docker/entrypoint.sh .

RUN chmod +x entrypoint.sh tini

WORKDIR /srv

ENTRYPOINT ["/tini", "--", "/entrypoint.sh"]

# Production Image
FROM node:18 as production

COPY --from=builder /tini /entrypoint.sh .

WORKDIR /app

COPY --from=builder /srv/package.json /srv/yarn.lock /srv/.yarn /srv/prisma .
COPY --from=builder /srv/dist ./dist

RUN yarn install --production  --silent

ENTRYPOINT ["/tini", "--", "/entrypoint.sh"]
