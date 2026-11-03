FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./server.mjs
ENV LAB_HOST=0.0.0.0
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
