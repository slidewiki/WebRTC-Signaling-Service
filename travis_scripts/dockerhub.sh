#!/bin/bash

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t slidewiki/webrtcstunservice ./
docker push slidewiki/webrtcstunservice
