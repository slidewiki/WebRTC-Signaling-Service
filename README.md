# WebRTC STUN Service #
[![Build Status](https://travis-ci.org/slidewiki/WebRTC-STUN-Service.svg?branch=master)](https://travis-ci.org/slidewiki/WebRTC-STUN-Service)
[![License](https://img.shields.io/badge/License-MPL%202.0-green.svg)](https://github.com/slidewiki/WebRTC-STUN-Service/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/Language-Javascript%20ECMA2015-lightgrey.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Framework](https://img.shields.io/badge/Framework-NodeJS%206.11.0-blue.svg)](https://nodejs.org/)
[![Webserver](https://img.shields.io/badge/Socket%20Framework-Socket.io%202.0-blue.svg)](http://hapijs.com/)


Simple STUN Service for the WebRTC parts of slidewiki-platform.

### Install NodeJS ###
---
Please visit the wiki at [**Install NodeJS**](https://github.com/slidewiki/microservice-template/wiki/Install-NodeJS).

### Where to start developing? ###
---
Have a look at the file [application/server.js](https://github.com/slidewiki/WebRTC-STUN-Service/blob/master/application/server.js), that is the main routine of this service. Follow the **require(...)** statements to get trough the entire code in the right order.

When you want to have a look at **tests**, head over to the folder [application/tests/](https://github.com/slidewiki/WebRTC-STUN-Service/tree/master/application/tests). We're using Mocha and Chai for our purposes.

Since we're developing our application with NodeJS, we're using [npm](https://docs.npmjs.com/) as a **task runner**. Have a look at the [/application/package.json](https://github.com/slidewiki/WebRTC-STUN-Service/blob/master/application/package.json) script section to obtain an overview of available commands. Some are:

```
# Run syntax check and lint your code
npm run lint

# Run unit tests
npm run unit:test

# Start the application
npm start
...
```

### Use Docker to run/test your application ###
---
You can use [Docker](https://www.docker.com/) to build, test and run your application locally. Simply edit the Dockerfile and run:

```
docker build -t MY_IMAGE_TAG ./
docker run -it --rm -p 8880:3000 MY_IMAGE_TAG
```

Alternatively you can use [docker-compose](https://docs.docker.com/compose/) to run your application in conjunction with a (local) mongodb instance. Simply execute:

```
docker-compose up -d
```
