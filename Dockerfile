FROM node:8

ADD ./demo-project /code

RUN apt-get update && \
    apt-get install --no-install-recommends -y icnsutils graphicsmagick

# Run package command to ask electron to download all necessary files
# and save it to cache.
RUN cd /code && \
    yarn && \
    yarn package-all && \
    cd / && \
    rm -rf /code \

ENV ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
