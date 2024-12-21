FROM node:22.12.0-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN yarn install --cache-folder /tmp/.yarn-cache && rm -rf /tmp/.yarn-cache

COPY --chown=node:node . .

USER node

EXPOSE 4000

CMD [ "yarn", "start:dock" ]