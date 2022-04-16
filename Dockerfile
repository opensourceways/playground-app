FROM gplane/pnpm as Builder

RUN mkdir -p /home/opengauss-moocstudio/web
WORKDIR /home/opengauss-moocstudio/web
COPY . /home/opengauss-moocstudio/web

RUN pnpm install

RUN pnpm build

FROM nginx:1.20.0

# COPY ./deploy/test-login.html /usr/share/nginx/html/test-login.html

COPY --from=Builder /home/opengauss-moocstudio/web/dist/ /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/nginx/nginx.conf /etc/nginx/nginx.conf


ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

