# FROM amazon/aws-lambda-nodejs:14
# FROM amazon/aws-lambda-nodejs:16.2023.11.18.13-x86_64
# FROM public.ecr.aws/lambda/nodejs:16.2023.11.18.13-x86_64
FROM amazon/aws-lambda-nodejs:18.2023.11.18.01

COPY ./package.json ./package-lock.json ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm install --only=prod

COPY . ${LAMBDA_TASK_ROOT}

CMD [ "index.lambdaHandler" ]