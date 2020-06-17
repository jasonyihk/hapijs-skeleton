'use strict';

const Confidence = require('confidence');
const Config = require('./config');
const Pack = require('../../package');
const Prom = require('epimetheus').hapi;
const HapiPino = require('hapi-pino');
const HapiCors = require('hapi-modern-cors');

let internals = {
    criteria: {
        env: process.env.NODE_ENV
    }
};

internals.manifest = {
    server: {
        host : Config.server.host,
        port: Config.server.port
    },
    register: {
        plugins : [
        // Debugging
        {
            plugin:  require('hapi-dev-errors'),
            options: {
                showErrors: process.env.NODE_ENV !== 'production'
            }
        },
        //prometheus
        {
            plugin : Prom,
            option: {}
        },
        //mongodb
        /*
        {
            plugin : './lib/mongodb',
            options: Config.mongodb
        },
        */
        // Logging pino
        {
            plugin: HapiPino,
            options: Config.pino
        },
        // Static file and directory handlers
        {
            plugin: '@hapi/inert'
        },
        {
            plugin: '@hapi/vision'
        },
        // Swagger support
        {
            plugin: 'hapi-swagger',
            options: {
                documentationPage: process.env.NODE_ENV !== 'production',
                documentationPath: Config.basePath + 'documentation',
                swaggerUIPath: Config.basePath + 'swaggerui/',
                jsonPath: Config.basePath + 'swagger.json',
                info: {
                    title: 'member service API',
                    version: Pack.version,
                },
                host: Config.server.server,
                securityDefinitions: {
                    'jwt': {
                        'type': 'apiKey',
                        'name': 'Authorization',
                        'in': 'header'
                    }
                },
                security: [{ 'jwt': [] }]
            }
        },
        /* Basic authentication
        {
            plugin: '@hapi/basic'
        },
         JWT authentication
        {
            plugin: 'hapi-auth-jwt2'
        },
          JWT-Authentication strategy
        {
            plugin:  './lib/jwtAuth',
            options: Config.jwtAuthOptions
        },
        {
            plugin:  './lib/basicAuth',
            options: Config.basicAuthOptions
        },
        */
        // API routes
        {
            plugin: './api/routes/v1/member.js'
        },
        // API routes cors
        {
            plugin: HapiCors,
            options: Config.cors
        },
        ]
    }
};

internals.store = new Confidence.Store(internals.manifest);

exports.get = function(key) {
    return internals.store.get(key, internals.criteria);
};

exports.meta = function(key) {
    return internals.store.meta(key, internals.criteria);
};
