'use strict';

const Boom = require('@hapi/boom');
const APIError = require('lib/error').BaseError;
const logger = require("helpers/logger")('errorHandler');

exports.handleError = async (error) => {
    return new Promise(async (resolve, reject)=> {
        try {
            if(error instanceof APIError) {
                const _error = Boom.badImplementation(error);
                _error.output.statusCode = error.httpStatusCode;
                _error.output.payload = error.toJson();
                _error.reformat();

                return reject(_error);
            }

            return reject(Boom.badImplementation(error));

        } catch (error) {
            logger.error(error);
            return reject(Boom.badImplementation(error));
        }

    });
}