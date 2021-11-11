FROM node:14.17.3-alpine


# Create app directory
WORKDIR /usr/src/app

# Define graphql server port
ARG ENV_ARG=production

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm i -g npm@7.5.6
RUN npm install

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source & config files for TypeORM & TypeScript
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./notifications.yml .

RUN npm run build

ENV NODE_ENV=${ENV_ARG}

CMD ["/bin/sh", "-c", "npm run start:prod"]
