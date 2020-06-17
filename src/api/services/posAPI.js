'use strict';

const Promise = require('promise');
const Boom = require('@hapi/boom');
const got = require('got');

const Config = require('config/config');
const authService = require("api/services/authAPI");
const POSError = require('lib/error').POSError;
const APIError = require('lib/error').APIError;
const logger = require("helpers/logger")('services:posAPI');

// Helper method for finding user details can be called from web and mobile api controller.
exports.callAPI = async (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            // get AUTH service URI
            let uriReq = {
                targetUriConfigKey: 'auth.service.sign.uri',
                callApiType: 'auth',
                request: options.request
            };

            let authUri = await exports.getUri(uriReq);
            if(!authUri.uri || !authUri.domain){
                return reject(Boom.notFound(`Auth Uri not found for: ${authReq}.`, { code: 20002 }));
            }

            //get POS service uri
            uriReq = {
                targetUriConfigKey: options.targetUriConfigKey,
                callApiType: 'pos',
                request: options.request,
                payload: options.payload,
                uriReplaceObj: options.uriReplaceObj
            }

            let posUri = await exports.getUri(uriReq);
            if(!posUri.uri || !posUri.domain) {
                return reject(Boom.notFound(`POS Uri not found for input: ${input}.`, { code: 20002 }));
            }

            //call AUTH service to get TOTP token
            let authReq = {
                request: options.request,
                payload: options.payload,
                url: authUri.domain + authUri.uri,
                method: authUri.method,
                signUri: posUri.uri,
                signMethod: posUri.method
            }
            let authRes = null;
            
            try {
                authRes = await authService.callAPI(authReq);
            }
            catch(error){
                console.log(error)
                return reject(error);
            }

            if(!authRes || !authRes) {
                return reject(Boom.notFound(`Failed to get auth token: ${authRes}.`, { code: 20002 }));
            }

            //call POS service
            let posReq = {
                headers: authRes,
                method: posUri.method,
                timeout: Config.posApi.timeout,
                resolveWithFullResponse: true,
                time: true,
                followAllRedirects: true,
                responseType: 'json'
            };
            posReq.headers.referenceid = options.requestId;
            if (posUri.method === 'GET') {
                posReq.searchParams = options.payload;
            } else {
                posReq.headers['content-type'] = 'application/json';
                posReq.body = JSON.stringify(options.payload);
            }
            let url = posUri.domain + posUri.uri;

            const posRes = await got(url, posReq);
            const {body} = posRes;

            logger.logHttpCall({url: url, posReq}, posRes);

            let _error = new POSError('POS', body);
            if(_error.isServer || _error.isClient) {
                return reject(_error);
            }

            return resolve(body);

        } catch (error) {
            logger.error(error);
            return reject(new APIError('POS', true, error));
        }
    });
};

exports.getUri = async (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            let domain = options.callApiType === 'pos' ? Config.posApi['domain'] : Config.authApi['domain'];
            let url = options.callApiType === 'pos' ? Config.posApi[options.targetUriConfigKey] : Config.authApi[options.targetUriConfigKey];

            let uriConfigValue = url.split('_');
            if (uriConfigValue.length < 2) {
                return reject(Boom.badImplementation(`incorrect configuration: ${uriConfigValue}`, { code: 20001 }));
            }
    
            let method = uriConfigValue[0].toUpperCase();
            let uri = uriConfigValue[1];
    
            const paramRegex = /{([^}]+)}/g;
            let resultUri = uri;
            let match = paramRegex.exec(uri);
    
            while (options.uriReplaceObj && match) {
                if (options.uriReplaceObj[match[1]]) {
                    resultUri = resultUri.replace(match[0], promiseObj.uriReplaceObj[match[1]]);
                }
                match = paramRegex.exec(uri);
            }
    
            let result = {
                domain: domain,
                method: method,
                uri: resultUri
            };

            return resolve(result);

        } catch (error) {
            logger.error(error, `[getUri] caught exception`);
            return reject(Boom.boomify(error));
        }
    });
};