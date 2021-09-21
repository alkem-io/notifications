FROM node:14.17.3-alpine


# Create app directory
WORKDIR /usr/src/app

# Define graphql server port
ARG GRAPHQL_ENDPOINT_PORT_ARG=4000
ARG ENV_ARG=production

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm i -g npm@latest
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source & config files for TypeORM & TypeScript
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .

RUN npm run build

ENV GRAPHQL_ENDPOINT_PORT=${GRAPHQL_ENDPOINT_PORT_ARG}
ENV NODE_ENV=${ENV_ARG}

EXPOSE ${GRAPHQL_ENDPOINT_PORT_ARG}
CMD ["/bin/sh", "-c", "npm run start:prod"]
