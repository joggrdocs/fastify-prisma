#!/bin/bash

docker compose up -d
sleep 5
npm install
npm run prisma:deploy
npm run prisma:seed
npm run serve 
