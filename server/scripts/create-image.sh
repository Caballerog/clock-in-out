#!/usr/bin/env bash
docker rm -f clock-backend
docker rmi -f ccaballerog/clock-backend
docker image prune
docker volume prune
docker build -t ccaballerog/clock-backend ..