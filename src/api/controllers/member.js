'use strict';

const joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const MemberHelper = require('api/services/member');
const JoiSchema = require('config/joi_schema');
const logger = require("helpers/logger")('controller:member');
const errHandler = require('helpers/errorHandler')

//get member profile
exports.getSponsorInfo = {
    description: 'get sponsor detail',
    validate: {
        options: {
            allowUnknown: true
        },
        headers: {
            authorization: joi.string().optional().description('Auth Token')
        },
        params: {
            sponsorId: joi.string().required()
        },
        failAction: async (request, h, error) => {
            logger.error(error, `[getSponsorInfo][validate] caught exception`);
            return Boom.boomify(error);
        }
    },
    handler: async (request, h) => {
        try {
            let result = await MemberHelper.getSponsorInfo(request);
            return h.response(result).code(200);
        } catch (error) {
            return errHandler.handleError(error);
        }
    },
    tags: ['api'] //swagger documentation
};

// check duplicate member
exports.checkDuplicates = {
    description: 'check duplicate member',
    validate: {
        options: {
            allowUnknown: true
        },
        headers: {
            authorization: joi.string().optional().description('Auth Token')
        },
        payload: {
            data: joi.alternatives().try(JoiSchema.duplicateSchema).required()
        },
        failAction: async (request, h, error) => {
            logger.error(error, `[checkDuplicates][validate] caught exception`);
            return Boom.boomify(error);
        }
    },
    handler: async (request, h) => {
        try {
            let result = await MemberHelper.checkDuplicates(request);
            return h.response(result).code(200);

        } catch (error) {
            return errHandler.handleError(error);
        }
    },
    tags: ['api'] //swagger documentation
};

// registration
exports.register = {
    description: 'create member',
    validate: {
        options: {
            allowUnknown: true
        },
        headers: {
            authorization: joi.string().optional().description('Auth Token')
        },
        payload: {
            data: joi.alternatives().try(JoiSchema.registerSchema).required()
        },
        failAction: async (request, h, error) => {
            logger.error(error, `[register][validate] caught exception`);
            return Boom.boomify(error);
        }
    },
    handler: async (request, h) => {
        try {
            let result = await MemberHelper.register(request);
            return h.response(result).code(200);

        } catch (error) {
            return errHandler.handleError(error);
        }
    },
    tags: ['api'] //swagger documentation
};
