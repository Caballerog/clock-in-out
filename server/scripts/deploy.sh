#!/usr/bin/env bash
sh create-image.sh
docker-compose -f ../docker-compose.production.yml up --force-recreate