FROM node:alpine as Builder

MAINTAINER devin<caowendong@huawei.com>

RUN mkdir -p /home/openeuler-playground/web
WORKDIR /home/openeuler-playground/web
COPY . /home/openeuler-playground/web

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm build

FROM nginx:1.20.0

COPY --from=Builder /home/openeuler-playground/web/dist/ /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./deploy/test-login.html /etc/nginx/html/test-login.html

ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

