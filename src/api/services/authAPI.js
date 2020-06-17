'use strict';

const Promise = require('promise');
const Boom = require('@hapi/boom');
const got = require('got');

const Config = require('config/config');
const APIError = require('lib/error').APIError;
const logger = require("helpers/logger")('services:authAPI');

exports.callAPI = async (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authUri = options.signMethod + '_' + options.signUri;
            let requestOptions = {
                headers: {
                    'x-auth-uri': authUri,
                    referenceid: options.requestId
                },
                method: options.method,
                timeout: Config.authApi.timeout,
                resolveWithFullResponse: true
            };

            if (options.method === 'GET') {
                requestOptions.searchParams = options.payload;
            } else {
                requestOptions.headers['content-type'] = 'application/json';
                requestOptions.body = JSON.stringify(options.payload);
            };

            let authRes = await got(options.url, requestOptions);
            let body = JSON.parse(authRes.body);

            logger.logHttpCall({url: options.url, requestOptions}, authRes);

            if(!body.data) {
                return reject(Boom.notFound(`failed to get auth token for request: ${JSON.stringify(options)}.`, { code: 20002 }));
            }

            return resolve(body.data);

        } catch (error) {
            logger.error(error);
            return reject(new APIError('AUTH', true, error));
        }

    });

};