FROM node:16.15.0-alpine


# Create app directory
WORKDIR /usr/src/app

# Define graphql server port
ARG ENV_ARG=production

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./service/package*.json ./

RUN npm i -g npm@8.5.5
RUN npm install

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source & config files for TypeORM & TypeScript
COPY ./service/src ./src
COPY ./service/tsconfig.json .
COPY ./service/tsconfig.build.json .
COPY ./service/notifications.yml .

RUN npm run build

ENV NODE_ENV=${ENV_ARG}

EXPOSE 4004

CMD ["/bin/sh", "-c", "npm run start:prod"]
