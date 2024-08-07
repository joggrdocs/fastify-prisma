#!/bin/bash

npm install
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
npm run serve 
