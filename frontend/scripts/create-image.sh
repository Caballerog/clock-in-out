#!/usr/bin/env bash
docker rm -f clock-frontend
docker rmi -f ccaballerog/clock-frontend
docker image prune
docker volume prune
docker build -t ccaballerog/clock-frontend ..
