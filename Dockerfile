ARG WORK_DIR=/opt

### Base ###
FROM node:12.18.0-alpine AS base

ARG WORK_DIR

COPY . ${WORK_DIR}/

### Build ###
FROM node:12.13.0-alpine AS build

ARG WORK_DIR

RUN set -x \
	&& apk update \
    && apk --no-cache add git openssh-client --virtual builds-deps build-base python3 \
    && rm -rf /var/cache/apk/*

# setup ssh key for bitbucket
RUN mkdir /root/.ssh && touch /root/.ssh/known_hosts \
	&& ssh-keyscan -t rsa bitbucket.org >> ~/.ssh/known_hosts \
    && ssh-keyscan -t rsa bitbucket.lkkhpgdi.com >> ~/.ssh/known_hosts

COPY --from=base ${WORK_DIR}/ ${WORK_DIR}/

WORKDIR ${WORK_DIR}

RUN chmod 400 keys/id_rsa \
    && cp keys/id_rsa /root/.ssh/ 

# install node module
RUN yarn install --production --ignore-engines --ignore-optional

### Release ###
FROM node:12.13.0-alpine AS release

ARG WORK_DIR
ENV WORK_DIR=${WORK_DIR}

WORKDIR ${WORK_DIR}

COPY --from=build --chown=node:node ${WORK_DIR}/ ${WORK_DIR}/

USER node

EXPOSE 9000

CMD ["node", "src/server.js"]