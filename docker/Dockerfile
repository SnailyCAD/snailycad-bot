FROM node:18 as development

COPY docker/entrypoint.sh /
RUN chmod +x entrypoint.sh

WORKDIR /app

ENTRYPOINT ["/entrypoint.sh"]

FROM development as production

COPY . .
