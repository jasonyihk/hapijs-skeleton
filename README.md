# member service

A Member API Service

[![Build Status](https://jenkins.lkkhpgdi.com/buildStatus/icon?job=member%2Fmaster)](https://jenkins.lkkhpgdi.com/view/api.services/job/member/job/master/)

## Requirements

 - [Node.js](http://nodejs.org/download/) `>=12.x` 
 - [MongoDB](http://www.mongodb.org/downloads) `>=2.6` 


## Running the app

```bash
$ npm start

# > node server.js

```

Now you should be able to point your browser to http://127.0.0.1:9000/


## Running tests

[Lab](https://github.com/hapijs/lab) is part of the hapi ecosystem and what we
use to write all of our tests.

```bash
$ npm test

# > frame@0.0.0 test /home/jedireza/projects/frame
# > lab -c -L

```

## Debugging in K8S ##
Tilt used to debug nodejs application in hot-reloading mode:

### Install Tilt: https://tilt.dev/
```sh
$ brew install windmilleng/tap/tilt
```

### Use DEV as debugging env
```sh
update Tiltfile and set: allow_k8s_contexts('dev.cluster.kops.k8s.local')
```

### Start debugging
```sh
$ tilt up
```
