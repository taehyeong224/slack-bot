# alpine 버전은 node.js 공식 이미지보다 몇 배나 가볍습니다.
# 6xx mb vs 13x mb
FROM mhart/alpine-node:10.14.2

RUN apk add --no-cache openssl
RUN apk add --no-cache bash
RUN apk add --no-cache openrc
RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /app
COPY . /app

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz


RUN pwd
RUN ls

# RUN 명령어는 배열로도 사용할 수 있습니다.
EXPOSE 3000
RUN chmod +x before.sh
CMD sh before.sh

