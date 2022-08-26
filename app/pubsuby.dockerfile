FROM node:latest
ARG ENVIRONMENT
WORKDIR /app/
COPY package.json /
RUN yarn global add typescript
RUN echo "building for $ENVIRONMENT"
RUN if [ "$ENVIRONMENT" = "development" ]; then yarn global add nodemon ts-node ; yarn install ; fi
RUN if [ "$ENVIRONMENT" = "production" ]; then yarn install --production; fi
COPY . .
RUN tsc