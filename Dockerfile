# Base stage for shared dependencies
FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Development stage
FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=base /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
