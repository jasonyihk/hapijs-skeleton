'use strict';

const Promise = require('promise');
const Boom = require('@hapi/boom');
const Utils = require('helpers/utils');
const POS = require('api/services/posAPI');
const logger = require("helpers/logger")('services:member');

// Helper method for finding user details can be called from web and mobile api controller.
exports.getSponsorInfo = async (request)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let payload = request.query;
            payload.sponsorID = request.params.sponsorId;

            let reqOptions = {
                userId: null,
                type: 'distributor',
                targetUriConfigKey: 'pos.verify.sponsor.uri',
                payload: payload,
                request: request
            };

            let ret = await POS.callAPI(reqOptions);
            return resolve(ret);
        } catch (error) {
            logger.error(error, `[getSponsorInfo]: caught exception`);
            return reject(error);
        }
    });
};

exports.checkDuplicates = async function (request) {
    return new Promise(async (resolve, reject)=>{
        try {
            let payload = Object.assign({}, request.payload.data);

            let reqOptions = {
                userId: null,
                type: 'member',
                targetUriConfigKey: 'pos.check.members.duplication.uri',
                payload: payload,
                request: request
            };

            let ret = await POS.callAPI(reqOptions);
            return resolve(ret);

        } catch (error) {
            logger.error(error, `[checkDuplicates] caught exception`);
            return reject(error);
        }
    });
};

exports.register = async function (request) {
    return new Promise(async (resolve, reject) => {
        let payload = Object.assign({}, request.payload.data);
        let reqOptions = {
            userId: null,
            type: 'member',
            targetUriConfigKey: 'pos.add.distributor.uri',
            payload: payload,
            request: request
        };

        try {
            let ret = await POS.callAPI(reqOptions);
            return resolve(ret);

        } catch (error) {
            request.ALERT = true;
            logger.error(error, `[register] caught exception`);
            return reject(error);
        }
    });
};

