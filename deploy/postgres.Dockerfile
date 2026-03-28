FROM postgis/postgis:15-3.4-alpine

RUN apk add --no-cache --virtual .build-deps \
    git \
    build-base \
    postgresql-dev \
    clang15 \
    llvm15 \
    make

RUN cd /tmp && \
    git clone --branch v0.7.0 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && \
    make install

RUN rm -rf /tmp/pgvector && \
    apk del .build-deps
