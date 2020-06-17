'use strict';

require('app-module-path').addPath(__dirname);

require('make-promises-safe')

const Glue = require('@hapi/glue');
const Manifest = require('config/manifest');
const RspHandler = require('helpers/rspHandler');
const Config = require('config/config');

const GRACEFUL_EXIT_TIMEOUT = 60 * 1000;

process
    .on('SIGINT', () => { exitHandler(0); })
    .on('SIGTERM', () => { exitHandler(0); })
    .on('uncaughtException', (err) => {
        console.error('uncaughtException', err);
        exitHandler(1);
    })
    .on('unhandledRejection', (reason, promise) => {
        console.error(`Unhandled Rejection at: ${JSON.stringify(promise)} reason: ${reason}`);
    })
    ;


let server;
const init = async function () {
    const options = { relativeTo: __dirname };
    server = await Glue.compose(Manifest.get('/'), options);

    server.ext('onPreResponse', async (request, h) => {
        let url = request.url.toString();
        let pattens = new RegExp(Config.ignorePathPatterns.join('|'));

        if(!pattens.test(url)) { 
            let ret = await RspHandler.transform(request);
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server started on port ${Manifest.get('/server/port')}`);
};

const exitHandler = (exitCode) => {
    if(server) {
        server.stop({timeout: GRACEFUL_EXIT_TIMEOUT}, () => {
            console.log(`Disconnecting server in ${GRACEFUL_EXIT_TIMEOUT} seconds...`);
        });
    }
    console.log(`Server Stopped...`);

    console.log(`Process Exited...`);
    process.exit(exitCode);
};

init();
