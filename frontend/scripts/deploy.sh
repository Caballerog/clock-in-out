#!/usr/bin/env bash
npm run build
sh create-image.sh
docker-compose -f ../docker-compose.production.yml up --force-recreate
