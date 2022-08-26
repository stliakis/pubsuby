FROM nginx

WORKDIR /

COPY ./configs/nginx.conf /etc/nginx/nginx.conf
COPY ./configs/common_proxy_headers.conf /etc/nginx/common_proxy_headers.conf

RUN apt-get update && apt-get install -y net-tools